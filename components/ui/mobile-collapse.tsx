"use client";

import { useId, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

/**
 * Clamps a long block on small screens and hands the reader a "Read more"
 * control; above `lg` it is inert and the children render in full.
 *
 * The clamp is CSS, not conditional rendering: the content is always in the
 * DOM, so it stays searchable, linkable and available to assistive tech, and
 * there is no layout shift when the breakpoint changes. `.mobile-collapse` in
 * globals.css drops the clamp at the `lg` breakpoint, which is why the height
 * can be an inline custom property here.
 */
export default function MobileCollapse({
  children,
  /** Visible height while collapsed, in px. */
  collapsedHeight = 520,
  moreLabel = "Read more",
  lessLabel = "Show less",
  /** Colour the bottom fade resolves to; match the section's background. */
  fadeTo = "var(--color-canvas)",
  className,
  /** Padding wrapper for the control, when the children bring their own. */
  controlClassName,
}: {
  children: React.ReactNode;
  collapsedHeight?: number;
  moreLabel?: string;
  lessLabel?: string;
  fadeTo?: string;
  className?: string;
  controlClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className={className}>
      <div
        id={id}
        className={cn("relative", !open && "mobile-collapse")}
        style={
          !open
            ? ({ "--collapse-h": `${collapsedHeight}px` } as React.CSSProperties)
            : undefined
        }
      >
        {children}
        {!open && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 lg:hidden"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${fadeTo} 92%)`,
            }}
          />
        )}
      </div>

      <div className={controlClassName}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-5 text-[14px] font-semibold text-[var(--color-ink)] transition-colors active:bg-[var(--color-brand-subtle)] lg:hidden"
        >
          {open ? lessLabel : moreLabel}
          <CaretDown
            size={14}
            weight="bold"
            aria-hidden="true"
            className={cn(
              "transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
    </div>
  );
}
