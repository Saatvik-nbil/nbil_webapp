"use client";

import { useRef, useState, type FormEvent } from "react";
import { OriginButton } from "@/components/ui/origin-button";
import { machines } from "@/lib/machines";
import {
  FIELD,
  FormError,
  FormSuccess,
  Honeypot,
  LABEL,
  SelectCaret,
  TEXTAREA,
} from "./fields";
import { readField, useFormSubmit } from "./useFormSubmit";

const INTERESTS = ["Request a quote", "Book a live demo", "Custom configuration", "General enquiry"];

/**
 * Quote / demo request form used by `ContactSection`. Replaces the former
 * HubSpot embed — submissions go to `/api/forms` → Google Sheets.
 *
 * `defaultModel` preselects a bioprinter, so the form on a machine page arrives
 * already scoped to that model.
 */
export default function QuoteForm({ defaultModel }: { defaultModel?: string }) {
  const { status, error, submit, reset } = useFormSubmit("quote");
  const formRef = useRef<HTMLFormElement>(null);
  const [interest, setInterest] = useState(INTERESTS[0]);

  const busy = status === "submitting";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const ok = await submit(
      [
        { label: "Name", value: readField(data, "name") },
        { label: "Work Email", value: readField(data, "email") },
        { label: "Phone", value: readField(data, "phone") },
        { label: "Organization", value: readField(data, "organization") },
        { label: "Model of Interest", value: readField(data, "model") },
        { label: "Enquiry Type", value: interest },
        { label: "Message", value: readField(data, "message") },
      ],
      readField(data, "company_website"),
    );

    if (ok) formRef.current?.reset();
  }

  if (status === "success") {
    return (
      <FormSuccess
        title="Request received"
        body="Our team will get back to you within 2 business days with pricing and next steps."
        onReset={reset}
        resetLabel="Send another request"
      />
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative flex flex-col gap-4">
      <Honeypot />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-name" className={LABEL}>
          Full name *
        </label>
        <input
          id="quote-name"
          name="name"
          required
          autoComplete="name"
          disabled={busy}
          placeholder="Dr. Anita Rao"
          className={FIELD}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quote-email" className={LABEL}>
            Work email *
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={busy}
            placeholder="anita@lab.edu"
            className={FIELD}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quote-phone" className={LABEL}>
            Phone
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            disabled={busy}
            placeholder="+91 98765 43210"
            className={FIELD}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-organization" className={LABEL}>
          Organization *
        </label>
        <input
          id="quote-organization"
          name="organization"
          required
          autoComplete="organization"
          disabled={busy}
          placeholder="IISc Bengaluru"
          className={FIELD}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-model" className={LABEL}>
          Model of interest
        </label>
        <div className="relative">
          <select
            id="quote-model"
            name="model"
            defaultValue={defaultModel ?? "Not sure yet"}
            disabled={busy}
            className={`${FIELD} appearance-none pr-9`}
          >
            <option value="Not sure yet">Not sure yet</option>
            {machines.map((m) => (
              <option key={m.slug} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <SelectCaret />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className={LABEL}>What do you need?</span>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] p-1.5">
          {INTERESTS.map((option) => (
            <button
              key={option}
              type="button"
              disabled={busy}
              onClick={() => setInterest(option)}
              aria-pressed={interest === option}
              className={[
                "h-9 rounded-lg px-3.5 text-[13px] font-medium transition-colors disabled:opacity-60",
                interest === option
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
              ].join(" ")}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quote-message" className={LABEL}>
          Message
        </label>
        <textarea
          id="quote-message"
          name="message"
          rows={3}
          disabled={busy}
          placeholder="Tell us about your application, throughput, and timeline…"
          className={TEXTAREA}
        />
      </div>

      {status === "error" && error ? <FormError message={error} /> : null}

      <OriginButton type="submit" loading={busy} disabled={busy} className="mt-1 h-12 px-6 font-semibold">
        {busy ? "Sending…" : "Send request"}
      </OriginButton>
    </form>
  );
}
