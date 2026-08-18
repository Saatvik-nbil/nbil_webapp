import { NextResponse } from "next/server";
import {
  FORMS,
  LIMITS,
  isFormId,
  type FormField,
  type FormForwardPayload,
} from "@/lib/forms";

/**
 * Server-side proxy between the site's forms and the Google Apps Script web
 * app. Going through the server (rather than posting to Apps Script from the
 * browser) keeps the script URL private, sidesteps Apps Script's awkward CORS
 * behaviour, and gives us one place to validate and rate-limit submissions.
 *
 * Requires `GOOGLE_SCRIPT_URL` (the /exec URL of the deployed Apps Script) and
 * optionally `GOOGLE_SCRIPT_SECRET`, which must match the script's
 * `CONFIG.SHARED_SECRET` when that is set.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORWARD_TIMEOUT_MS = 20_000;

/** Naive per-IP throttle. Single-instance only; it resets on redeploy, which is
 *  fine — it exists to blunt floods, not to be an audit trail. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function sanitizeFields(input: unknown): FormField[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  if (input.length > LIMITS.maxFields) return null;

  const fields: FormField[] = [];
  for (const raw of input) {
    if (typeof raw !== "object" || raw === null) return null;
    const { label, value } = raw as Record<string, unknown>;
    if (typeof label !== "string" || !label.trim()) return null;
    if (typeof value !== "string") return null;
    if (label.length > LIMITS.maxLabel || value.length > LIMITS.maxValue) return null;
    fields.push({ label: label.trim(), value: value.trim() });
  }
  return fields;
}

export async function POST(req: Request) {
  const endpoint = process.env.GOOGLE_SCRIPT_URL;
  if (!endpoint) {
    console.error("[forms] GOOGLE_SCRIPT_URL is not set");
    return NextResponse.json(
      { ok: false, error: "Form delivery is not configured." },
      { status: 500 },
    );
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { formId, fields, company_website } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: pretend it worked so bots don't learn anything from the response.
  if (typeof company_website === "string" && company_website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!isFormId(formId)) {
    return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 400 });
  }

  const cleanFields = sanitizeFields(fields);
  if (!cleanFields) {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const definition = FORMS[formId];
  const payload: FormForwardPayload = {
    formId,
    sheet: definition.sheet,
    subject: definition.subject,
    fields: cleanFields,
    ...(process.env.GOOGLE_SCRIPT_SECRET
      ? { secret: process.env.GOOGLE_SCRIPT_SECRET }
      : {}),
    meta: {
      submittedAt: new Date().toISOString(),
      page: req.headers.get("referer") ?? "",
      userAgent: req.headers.get("user-agent") ?? "",
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script 302-redirects /exec to googleusercontent.com to serve the
      // response body; the POST itself has already run by then.
      redirect: "follow",
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[forms] Apps Script responded", res.status, text.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: "We couldn't record your submission. Please email us instead." },
        { status: 502 },
      );
    }

    // The script returns JSON; anything else means the deployment is misconfigured
    // (most often "Who has access" is not set to "Anyone", so we get a login page).
    let parsed: { ok?: boolean; error?: string } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("[forms] Non-JSON from Apps Script:", text.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: "We couldn't record your submission. Please email us instead." },
        { status: 502 },
      );
    }

    if (!parsed.ok) {
      console.error("[forms] Apps Script error:", parsed.error);
      return NextResponse.json(
        { ok: false, error: "We couldn't record your submission. Please email us instead." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forms] Forward failed:", err);
    return NextResponse.json(
      { ok: false, error: "Network error. Please try again." },
      { status: 502 },
    );
  }
}
