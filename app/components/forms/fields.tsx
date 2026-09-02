"use client";

import { CaretDown, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Shared form primitives. Every form on the site pulls its label and field
 * styling from here so the controls stay identical across pages.
 */

export const LABEL =
  "text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]";

export const FIELD =
  "h-11 w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-3.5 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none transition-colors focus:border-[var(--color-brand)] focus:ring-3 focus:ring-[var(--color-brand)]/15 disabled:opacity-60";

export const TEXTAREA = `${FIELD} h-auto resize-y py-3 leading-relaxed`;

/** Red border + focus ring for a field that failed validation. */
export const FIELD_INVALID =
  "border-red-400 focus:border-red-500 focus:ring-red-500/15";

/**
 * `FIELD`, switched to the invalid treatment when `error` is set. Uses `cn` so
 * the red border actually replaces the default one — both are border-colour
 * utilities, and plain concatenation would leave the winner up to stylesheet
 * order rather than intent.
 */
export function fieldClass(error?: string, extra = "") {
  return cn(FIELD, error && FIELD_INVALID, extra);
}

/** `TEXTAREA`, with the same invalid treatment. */
export function textareaClass(error?: string, extra = "") {
  return cn(TEXTAREA, error && FIELD_INVALID, extra);
}

/** Message shown directly beneath the field it belongs to. */
export function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} role="alert" className="text-[12.5px] leading-snug text-red-700">
      {message}
    </p>
  );
}

/**
 * Off-screen decoy input. Bots fill every field they find; the API route drops
 * any submission where this arrives non-empty.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="company_website">Company website</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

/** Wraps a native select so it keeps the caret affordance the design uses. */
export function SelectCaret() {
  return (
    <CaretDown
      size={15}
      weight="bold"
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]"
    />
  );
}

/** Inline error banner, announced to screen readers when it appears. */
export function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3"
    >
      <WarningCircle size={17} weight="duotone" className="mt-px shrink-0 text-red-600" />
      <p className="text-[13px] leading-relaxed text-red-800">{message}</p>
    </div>
  );
}

/** Replaces the form once a submission lands. */
export function FormSuccess({
  title,
  body,
  onReset,
  resetLabel = "Send another",
}: {
  title: string;
  body: string;
  onReset?: () => void;
  resetLabel?: string;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] px-5 py-6"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
        <CheckCircle size={22} weight="duotone" className="text-[var(--color-brand-strong)]" />
      </span>
      <p className="text-[15px] font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-1 text-[13.5px] font-semibold text-[var(--color-brand-strong)] underline-offset-4 transition-colors hover:text-[var(--color-brand)] hover:underline"
        >
          {resetLabel}
        </button>
      ) : null}
    </div>
  );
}
