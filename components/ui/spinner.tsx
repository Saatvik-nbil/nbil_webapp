import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The single loading mark used across the site: a thin brand-coloured arc
 * riding a faint full-circle track. Pure SVG plus two CSS animations, so it
 * costs nothing to render and inherits `currentColor` wherever it lands.
 *
 * The arc rotates while its dash offset breathes, which reads as motion even
 * on a plain background. Under `prefers-reduced-motion` the arc holds still
 * and only the track fades, so the control still reads as busy.
 */
export function Spinner({
  size = 16,
  className,
  label,
}: {
  size?: number;
  className?: string;
  /** Announced to screen readers. Omit inside a control that already says it. */
  label?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        className="animate-[spinner-spin_0.9s_linear_infinite] motion-reduce:animate-none"
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.18"
        />
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="45"
          className="animate-[spinner-dash_1.4s_ease-in-out_infinite] motion-reduce:animate-none"
        />
      </svg>
    </span>
  );
}

/**
 * The assistant's "thinking" state: the spinner with a label whose ellipsis
 * animates a dot at a time.
 */
export function ThinkingIndicator({
  label = "Thinking",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label={`${label}, please wait`}
      className={cn(
        "inline-flex items-center gap-2 text-[13px] text-[var(--color-ink-muted)]",
        className,
      )}
    >
      <Spinner size={14} className="text-[var(--color-brand)]" />
      <span className="inline-flex items-baseline">
        {label}
        <span aria-hidden="true" className="inline-flex">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-[spinner-ellipsis_1.2s_ease-in-out_infinite] motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              .
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
