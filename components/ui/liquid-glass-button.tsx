"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Glass Filter — place once per page, referenced by filter id
   ───────────────────────────────────────────────────────────────────────────── */
export function LiquidGlassFilter({ id = "liquid-glass" }: { id?: string }) {
  return (
    <svg
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={id}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06 0.06"
            numOctaves="1"
            seed="3"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="55"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="3.5" result="out" />
          <feComposite in="out" in2="out" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LiquidButton — Apple-style liquid glass pill button
   Does NOT use Slot/asChild to avoid children conflicts.
   Instead pass `as` or wrap with `asChild` via a plain wrapper.
   ───────────────────────────────────────────────────────────────────────────── */

type LiquidButtonSize = "sm" | "md" | "lg" | "xl" | "icon";
type LiquidButtonVariant = "primary" | "ghost" | "outline";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: LiquidButtonSize;
  variant?: LiquidButtonVariant;
}

const sizeClasses: Record<LiquidButtonSize, string> = {
  sm:   "h-8  rounded-full px-4 text-[12px] gap-1.5",
  md:   "h-9  rounded-full px-5 text-[13px] gap-2",
  lg:   "h-11 rounded-full px-6 text-[14px] gap-2",
  xl:   "h-13 rounded-full px-8 text-[15px] gap-2.5",
  icon: "size-9 rounded-full",
};

export function LiquidButton({
  className,
  size = "md",
  variant = "primary",
  children,
  style,
  ...props
}: LiquidButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  return (
    <button
      data-slot="liquid-button"
      className={cn(
        "group relative inline-flex items-center justify-center cursor-pointer",
        "whitespace-nowrap font-medium select-none",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "hover:scale-[1.03] active:scale-[0.96]",
        sizeClasses[size],
        className,
      )}
      style={{ isolation: "isolate", ...style }}
      {...props}
    >
      {/* Layer 1: backdrop blur + glass distortion */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
        style={{
          backdropFilter: "blur(18px) saturate(190%) brightness(1.05)",
          WebkitBackdropFilter: "blur(18px) saturate(190%) brightness(1.05)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Layer 2: glass fill / tint */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: isPrimary
            ? "linear-gradient(145deg, rgba(109,40,217,0.90) 0%, rgba(91,33,182,0.84) 55%, rgba(76,29,149,0.92) 100%)"
            : isOutline
            ? "rgba(255,255,255,0.10)"
            : "rgba(255,255,255,0.06)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Layer 3: inner bevel + specular ring */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: isPrimary
            ? [
                "inset 0 1.5px 0 rgba(255,255,255,0.32)",
                "inset 0 -1px 0 rgba(0,0,0,0.22)",
                "inset 1px 0 0 rgba(255,255,255,0.14)",
                "inset -1px 0 0 rgba(0,0,0,0.12)",
                "0 0 0 1px rgba(109,40,217,0.55)",
                "0 4px 20px rgba(109,40,217,0.42)",
                "0 1px 4px rgba(0,0,0,0.20)",
              ].join(", ")
            : isOutline
            ? [
                "inset 0 1px 0 rgba(255,255,255,0.22)",
                "inset 0 -1px 0 rgba(0,0,0,0.10)",
                "0 0 0 1px rgba(109,40,217,0.22)",
                "0 2px 12px rgba(0,0,0,0.08)",
              ].join(", ")
            : [
                "inset 0 1px 0 rgba(255,255,255,0.16)",
                "0 0 0 1px rgba(109,40,217,0.10)",
              ].join(", "),
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* Layer 4: top gloss streak ("wet glass" shine) */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
        style={{ zIndex: 3 }}
        aria-hidden="true"
      >
        <span
          className="absolute inset-x-[10%] top-0 h-[46%] rounded-b-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.04) 70%, transparent 100%)",
          }}
        />
      </span>

      {/* Layer 5: hover shimmer */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.14) 0%, transparent 60%)",
          zIndex: 4,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <span
        className="relative flex items-center gap-[inherit]"
        style={{
          zIndex: 5,
          color: isPrimary ? "#ffffff" : "var(--color-ink)",
          textShadow: isPrimary ? "0 1px 2px rgba(0,0,0,0.28)" : "none",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LiquidLink — same glass effect but renders as an <a> tag
   Use this instead of LiquidButton when you need to wrap a Next.js Link
   ───────────────────────────────────────────────────────────────────────────── */
interface LiquidLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: LiquidButtonSize;
  variant?: LiquidButtonVariant;
}

export function LiquidLink({
  className,
  size = "md",
  variant = "primary",
  children,
  style,
  ...props
}: LiquidLinkProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  return (
    <a
      data-slot="liquid-link"
      className={cn(
        "group relative inline-flex items-center justify-center cursor-pointer",
        "whitespace-nowrap font-medium select-none no-underline",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/50",
        "hover:scale-[1.03] active:scale-[0.96]",
        sizeClasses[size],
        className,
      )}
      style={{ isolation: "isolate", ...style }}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden" style={{ backdropFilter: "blur(18px) saturate(190%) brightness(1.05)", WebkitBackdropFilter: "blur(18px) saturate(190%) brightness(1.05)", zIndex: 0 }} aria-hidden="true" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: isPrimary ? "linear-gradient(145deg, rgba(109,40,217,0.90) 0%, rgba(91,33,182,0.84) 55%, rgba(76,29,149,0.92) 100%)" : isOutline ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)", zIndex: 1 }} aria-hidden="true" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ boxShadow: isPrimary ? "inset 0 1.5px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.22), 0 0 0 1px rgba(109,40,217,0.55), 0 4px 20px rgba(109,40,217,0.42), 0 1px 4px rgba(0,0,0,0.20)" : "inset 0 1px 0 rgba(255,255,255,0.22), 0 0 0 1px rgba(109,40,217,0.22)", zIndex: 2 }} aria-hidden="true" />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden" style={{ zIndex: 3 }} aria-hidden="true"><span className="absolute inset-x-[10%] top-0 h-[46%] rounded-b-full" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.04) 70%, transparent 100%)" }} /></span>
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.14) 0%, transparent 60%)", zIndex: 4 }} aria-hidden="true" />
      <span className="relative flex items-center gap-[inherit]" style={{ zIndex: 5, color: isPrimary ? "#ffffff" : "var(--color-ink)", textShadow: isPrimary ? "0 1px 2px rgba(0,0,0,0.28)" : "none", letterSpacing: "-0.01em" }}>{children}</span>
    </a>
  );
}
