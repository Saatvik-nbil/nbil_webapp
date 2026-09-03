"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Quotes } from "@phosphor-icons/react";

/**
 * The site-wide testimonial pattern: a rotating quote card next to a copy
 * column with dot pagination and (optionally) a trusted-by logo row. Design
 * is carried over from the Dhee Slicer page's original testimonial section;
 * this is the shared version every page with a testimonial should use, so
 * the site doesn't accumulate one-off carousel/grid variants per page.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export type Testimonial = {
  /** Stable across rotations: used as the React key. */
  id: string | number;
  quote: string;
  name: string;
  role?: string;
  org?: string;
  /** Falls back to an initials monogram when no photo is supplied. */
  avatar?: string;
};

export type TrustedLogo = {
  name: string;
  /** Optional. Entries without artwork render a named placeholder tile, so a
   *  lab can appear in the row before its logo file arrives. */
  logo?: string;
  /** Shown in the card when this logo is hovered, focused or tapped: hover
   *  and focus revert on leave, a tap stays until it is tapped again. */
  testimonial?: Testimonial;
};

type Props = {
  id?: string;
  heading: React.ReactNode;
  description: string;
  testimonials: Testimonial[];
  trustedByLabel?: string;
  trustedLogos?: TrustedLogo[];
  className?: string;
  /**
   * Optional floor height (px) for the card column. Leave it unset: the
   * slides are stacked in one grid cell, so the column already sizes itself
   * to the longest quote and no shorter one leaves dead air beneath it.
   * Only set this when a section genuinely needs the card to match a taller
   * copy column beside it.
   */
  minCardHeight?: number;
};

/** "Dr. Janani Radhakrishnan" -> "JR". Honorifics are skipped. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => !/^(dr|prof|mr|mrs|ms)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** The quote/avatar/name block shared by every card: the rotating slides
 *  and the one shown on hovering a trusted-by logo. */
function TestimonialCardBody({ t }: { t: Testimonial }) {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-9 pb-7 shadow-[0_8px_40px_-8px_rgba(37,114,253,0.16),0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="relative mb-7 flex-1">
        <Quotes
          weight="fill"
          size={32}
          className="absolute -top-1 -left-1 rotate-180 text-[var(--color-brand)]/[0.14]"
          aria-hidden="true"
        />
        <p className="relative z-[1] text-[16px] font-medium leading-[1.7] tracking-[-0.01em] text-[var(--color-ink)]">
          &ldquo;{t.quote}&rdquo;
        </p>
      </div>
      <div className="mb-5 h-px bg-[var(--color-hairline)]" />
      <div className="flex items-center gap-3.5">
        {t.avatar ? (
          <Image
            src={t.avatar}
            alt={t.name}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-[var(--color-hairline)] object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-hairline)] bg-[var(--color-brand-surface)] text-[13px] font-semibold text-[var(--color-brand-strong)]"
          >
            {initialsOf(t.name)}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold leading-tight text-[var(--color-ink)]">
            {t.name}
          </div>
          <div className="mt-[3px] truncate text-[12px] leading-tight text-[var(--color-ink-faint)]">
            {[t.role, t.org].filter(Boolean).join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A logo, or a named tile standing in for one that hasn't arrived yet. */
function LogoMark({ lab }: { lab: TrustedLogo }) {
  if (lab.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={lab.logo}
        alt={lab.name}
        title={lab.name}
        className="h-[60px] w-auto max-w-[170px] object-contain opacity-55 grayscale mix-blend-multiply transition-[opacity,filter] duration-300 ease-out group-hover:opacity-85 group-hover:grayscale-0"
      />
    );
  }
  return (
    <span
      title={lab.name}
      className="flex h-[60px] max-w-[170px] items-center rounded-lg border border-dashed border-[var(--color-hairline)] px-3 text-left text-[11.5px] font-medium leading-tight text-[var(--color-ink-faint)] transition-colors duration-300 group-hover:border-[var(--color-brand)] group-hover:text-[var(--color-brand-strong)]"
    >
      {lab.name}
    </span>
  );
}

export default function TestimonialsCarousel({
  id = "testimonials",
  heading,
  description,
  testimonials,
  trustedByLabel = "Trusted by teams from",
  trustedLogos,
  className,
  minCardHeight,
}: Props) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hoverTestimonial, setHoverTestimonial] = useState<Testimonial | null>(null);
  const multiple = testimonials.length > 1;

  useEffect(() => {
    // Pause the rotation while a trusted-by logo's testimonial is pinned up
    // front: cycling underneath it would just be wasted work.
    if (!multiple || reduce || hoverTestimonial) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(t);
  }, [multiple, reduce, testimonials.length, hoverTestimonial]);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`overflow-hidden border-y border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 lg:py-28 ${className ?? ""}`}
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:gap-[8vw]">
        {/* Copy column */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col"
        >
          <h2
            id={`${id}-heading`}
            className="font-display text-[clamp(1.75rem,3.2vw,2.875rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--color-ink)]"
          >
            {heading}
          </h2>
          <p className="mt-[18px] max-w-[400px] text-[15px] leading-[1.85] text-[var(--color-ink-muted)]">
            {description}
          </p>

          {/* Dots only earn their place with something to page between. */}
          {multiple && (
            <div className="mt-9 flex items-center gap-2.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  aria-current={active === i}
                  className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                    active === i
                      ? "w-9 bg-[var(--color-brand)]"
                      : "w-2.5 bg-[var(--color-brand)]/20 hover:bg-[var(--color-brand)]/35"
                  }`}
                />
              ))}
            </div>
          )}

          {trustedLogos && trustedLogos.length > 0 && (
            // Without dots above it (a single testimonial), mt-14 read as a
            // stray gap under the description with nothing to justify it:
            // mt-9 keeps the same rhythm the dots row uses in that case.
            <div className={multiple ? "mt-14" : "mt-9"}>
              <div className="mb-5 text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-ink-faint)]">
                {trustedByLabel}
              </div>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
                {trustedLogos.map((lab) =>
                  lab.testimonial ? (
                    // Hover and focus preview; a tap pins the quote and taps
                    // again to release it, since a touch screen never sends
                    // the mouse-leave that would otherwise restore the
                    // rotation.
                    <button
                      key={lab.name}
                      type="button"
                      onMouseEnter={() => setHoverTestimonial(lab.testimonial!)}
                      onMouseLeave={() => setHoverTestimonial(null)}
                      onFocus={() => setHoverTestimonial(lab.testimonial!)}
                      onBlur={() => setHoverTestimonial(null)}
                      onClick={() =>
                        setHoverTestimonial((prev) =>
                          prev?.id === lab.testimonial!.id ? null : lab.testimonial!,
                        )
                      }
                      aria-label={`Show the testimonial from ${lab.name}`}
                      aria-pressed={hoverTestimonial?.id === lab.testimonial.id}
                      className="group rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
                    >
                      <LogoMark lab={lab} />
                    </button>
                  ) : (
                    <span key={lab.name} className="group">
                      <LogoMark lab={lab} />
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Card column */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          // Every slide sits in the same grid cell, so the column is exactly
          // as tall as the longest quote: no fixed floor to leave dead air
          // under a short one, and no absolute slide overflowing a tall one.
          className="relative grid [grid-template-areas:'stack']"
          style={minCardHeight ? { minHeight: minCardHeight } : undefined}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-[var(--color-brand)]/5"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-[var(--color-brand)]/5"
          />

          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="[grid-area:stack] transition-[opacity,transform] duration-500 ease-out"
              style={{
                opacity: active === i && !hoverTestimonial ? 1 : 0,
                transform:
                  active === i
                    ? "translateX(0) scale(1)"
                    : "translateX(60px) scale(0.97)",
                pointerEvents: active === i && !hoverTestimonial ? "auto" : "none",
                zIndex: active === i ? 2 : 0,
              }}
            >
              <TestimonialCardBody t={t} />
            </div>
          ))}

          {/* Pinned up front on hovering/focusing a trusted-by logo: see
              the `trustedLogos` map above. */}
          <AnimatePresence>
            {hoverTestimonial && (
              <motion.div
                key={hoverTestimonial.id}
                className="z-10 [grid-area:stack]"
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <TestimonialCardBody t={hoverTestimonial} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
