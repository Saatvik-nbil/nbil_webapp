"use client";

import { useCallback, useState } from "react";
import type { FormField, FormId } from "@/lib/forms";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * Posts a form to `/api/forms` and tracks the request state.
 *
 * Every form on the site shares this hook so the loading / success / error
 * behaviour — and the honeypot contract — stays identical everywhere.
 */
export function useFormSubmit(formId: FormId) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (fields: FormField[], honeypot = "") => {
      setStatus("submitting");
      setError(null);

      try {
        const res = await fetch("/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formId, fields, company_website: honeypot }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };

        if (!res.ok || !data.ok) {
          setError(data.error ?? "Something went wrong. Please try again.");
          setStatus("error");
          return false;
        }

        setStatus("success");
        return true;
      } catch {
        setError("Network error. Please check your connection and try again.");
        setStatus("error");
        return false;
      }
    },
    [formId],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, submit, reset };
}

/** Reads a named value out of a submitted form, trimmed. */
export function readField(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}
