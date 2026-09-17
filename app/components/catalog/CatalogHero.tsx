"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import BrandDots from "@/app/components/shared/BrandDots";
import { machines } from "@/lib/machines";

const EASE = [0.16, 1, 0.3, 1] as const;

/** How long each machine holds the stage before the next one opens itself.
 *  Matches the landing page's machine spotlight, so the two read as the same
 *  cadence. */
const MACHINE_MS = 6000;

/** The panel sweep. Symmetric ease-in-out rather than the ease-out used for
 *  copy entrances: a panel this wide wants to gather speed and settle, not
 *  leap and coast. */
const SWEEP_MS = 900;
const SWEEP_EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

/** Copy crossfades across the sweep rather than swapping at the start of it:
 *  the outgoing panel's words leave quickly, the incoming panel's arrive once
 *  the geometry has nearly settled. */
const FADE_MS = 420;
const FADE_IN_DELAY = 380;

const VISIBLE = "visible" as const;
const HIDDEN = "hidden" as const;

/** How much of the stage a closed machine keeps. Horizontal on a wide screen,
 *  a stacked bar below lg, which is the same number either way because
 *  flex-basis follows whichever axis the row is running on. */
const CLOSED = "5.25rem";

/**
 * Per-machine colour, taken from the nbil mark. `ink` is the label colour on
 * the closed strip: amber never carries white type anywhere on this site
 * (1.7:1), so Aura's strip labels in a deep brown instead.
 */
const SKIN: Record<string, { from: string; to: string; ink: string; wash: string }> = {
  "trivima-np": {
    from: "#c40064",
    to: "#6d0038",
    ink: "#ffffff",
    wash: "rgba(196,0,100,0.30)",
  },
  "trivima-pro": {
    from: "#2c30a0",
    to: "#14175c",
    ink: "#ffffff",
    wash: "rgba(44,48,160,0.34)",
  },
  "trivima-aura": {
    from: "#ffb92b",
    to: "#b87f00",
    ink: "#3a2600",
    wash: "rgba(184,127,0,0.30)",
  },
};

/**
 * The bioprinter range as a horizontal accordion: one machine open across the
 * stage, the other two folded into strips that keep their place in the range's
 * order. Clicking a strip opens it and folds the last one away.
 *
 * It replaces a single lineup photo, which showed all three machines and said
 * nothing about any of them. This gives each its own full-bleed frame without
 * costing the page a second screen of height.
 */
export default function CatalogHero() {
  const reduce = useReducedMotion();
  const panelBase = useId();
  const [open, setOpen] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Keyed on `open`, so choosing a machine restarts its full dwell rather
     than inheriting whatever was left of the last one's. */
  useEffect(() => {
    if (reduce || paused) return;
    const timer = setTimeout(
      () => setOpen((i) => (i + 1) % machines.length),
      MACHINE_MS,
    );
    return () => clearTimeout(timer);
  }, [open, paused, reduce]);

  const hold = useCallback(() => setPaused(true), []);
  const release = useCallback(() => setPaused(false), []);

  /**
   * Arriving content waits for the sweep, leaving content goes at once, and
   * `visibility` does the rest: it flips to visible the moment something
   * starts arriving and to hidden only once it has finished leaving, which is
   * what keeps a folded panel's links out of the tab order without popping
   * the copy in and out. `hidden` cannot do this because it is not animatable.
   */
  const fade = useCallback(
    (shown: boolean) => {
      if (reduce) {
        return { visibility: shown ? VISIBLE : HIDDEN };
      }
      const delay = shown ? FADE_IN_DELAY : 0;
      return {
        visibility: shown ? VISIBLE : HIDDEN,
        transition:
          `opacity ${FADE_MS}ms ease-in-out ${delay}ms, ` +
          `visibility 0s linear ${shown ? 0 : FADE_MS}ms`,
      };
    },
    [reduce],
  );

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen((index + 1) % machines.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen((index - 1 + machines.length) % machines.length);
    }
  }

  return (
    <section
      aria-labelledby="hero-heading"
      data-nav-theme="dark"
      className="relative h-svh overflow-hidden bg-[var(--color-photo-ground)]"
      /* A reader looking at a machine should not have the stage move under
         them, so any pointer or focus inside the hero holds the rotation. */
      onPointerEnter={hold}
      onPointerLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      <h1 id="hero-heading" className="sr-only">
        Trivima bioprinters
      </h1>

      {/* Stacked below lg, the strips run down the page and the first one
          lands under the fixed navbar, whose whole box takes the clicks: the
          machine folded away at the top could not be reopened. The column is
          inset past it. pb below sm does the same for MobileStickyCTA, which
          otherwise sits on the last closed strip. */}
      <div className="flex h-full flex-col pt-20 pb-16 sm:pb-0 lg:flex-row lg:pt-0">
        {machines.map((machine, i) => {
          const isOpen = i === open;
          const skin = SKIN[machine.slug];
          const panelId = `${panelBase}-${machine.slug}`;

          return (
            <div
              key={machine.slug}
              /* min-w-0/min-h-0: a flex item will not go below its content's
                 min-content size by default, and a folded panel still has the
                 whole open layout inside it, so the strip was being forced
                 wider than its flex-basis by type it was not even showing. */
              className="relative isolate min-h-0 min-w-0 overflow-hidden border-b border-white/10 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              style={{
                flexGrow: isOpen ? 1 : 0,
                flexShrink: 0,
                flexBasis: isOpen ? "0%" : CLOSED,
                transition: reduce
                  ? undefined
                  : `flex-grow ${SWEEP_MS}ms ${SWEEP_EASE}, flex-basis ${SWEEP_MS}ms ${SWEEP_EASE}`,
              }}
            >
              {/* Closed: the machine's own colour. Open: its photo on the
                  dark stage, with a wash of the same colour so the panel
                  still reads as that machine. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 motion-reduce:transition-none"
                style={{
                  background: `linear-gradient(160deg, ${skin.from} 0%, ${skin.to} 100%)`,
                  opacity: isOpen ? 0 : 1,
                  transition: reduce ? undefined : `opacity ${SWEEP_MS}ms ${SWEEP_EASE}`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[var(--color-photo-ground)] motion-reduce:transition-none"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transition: reduce ? undefined : `opacity ${SWEEP_MS}ms ${SWEEP_EASE}`,
                }}
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background: `radial-gradient(110% 80% at 88% 55%, ${skin.wash}, transparent 70%)`,
                  opacity: isOpen ? 1 : 0,
                  ...fade(isOpen),
                }}
              />

              {/* Sits to the right of the copy, the way the machine sits
                  beside its own name on the model pages. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full lg:w-[52%]"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen || reduce ? "scale(1)" : "scale(1.04)",
                  ...fade(isOpen),
                  transition: reduce
                    ? undefined
                    : `${fade(isOpen).transition}, transform ${SWEEP_MS}ms ${SWEEP_EASE}`,
                }}
              >
                <Image
                  src={machine.heroImage.src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-contain object-center p-8 opacity-70 drop-shadow-[0_28px_60px_rgba(0,0,0,0.55)] lg:p-14 lg:opacity-100"
                />
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/55 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/45 lg:to-transparent"
                style={{ opacity: isOpen ? 1 : 0, ...fade(isOpen) }}
              />

              {/* Time left on this machine. Keyed on the pause flag as well as
                  the machine, so the bar and the timer driving it always
                  restart together. */}
              {!reduce && isOpen ? (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/15 transition-opacity duration-300 ${
                    paused ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <motion.div
                    key={`${machine.slug}-${paused}`}
                    className="h-full origin-left"
                    style={{ background: skin.from }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: MACHINE_MS / 1000, ease: "linear" }}
                  />
                </div>
              ) : null}

              {/* Closed strip: the whole panel is the control. It stays
                  mounted and fades, so the label never appears before the
                  panel it belongs to has finished narrowing. */}
              <button
                type="button"
                onClick={() => setOpen(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                tabIndex={isOpen ? -1 : 0}
                aria-hidden={isOpen}
                className={`group absolute inset-0 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80 ${
                  isOpen ? "pointer-events-none" : ""
                }`}
                style={{ opacity: isOpen ? 0 : 1, ...fade(!isOpen) }}
              >
                <span
                  className="flex items-center gap-3 px-3 text-[15px] font-semibold tracking-[-0.01em] transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none lg:[writing-mode:vertical-rl]"
                  style={{ color: skin.ink }}
                >
                  {machine.name}
                  <span className="text-[13px] font-normal opacity-75">
                    {machine.role}
                  </span>
                </span>
              </button>

              {/* Open panel. It stays laid out so it can fade; `visibility`
                  in `fade()` is what takes it out of the tab order once it
                  has finished folding away. */}
              <div
                id={panelId}
                className={`relative flex h-full flex-col justify-between gap-8 overflow-hidden p-7 pb-10 sm:p-10 sm:pb-12 lg:p-14 lg:pt-32 lg:pb-16 ${
                  isOpen ? "" : "pointer-events-none"
                }`}
                style={{ opacity: isOpen ? 1 : 0, ...fade(isOpen) }}
              >
                <div
                  className="flex flex-col gap-5"
                  style={{
                    transform: isOpen || reduce ? "none" : "translateY(14px)",
                    transition: reduce
                      ? undefined
                      : `transform ${SWEEP_MS}ms ${SWEEP_EASE}`,
                  }}
                >
                  <BrandDots tone="light" />
                  <p className="max-w-[40ch] text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.45] text-white/85">
                    {machine.tagline}
                  </p>
                </div>

                <div
                  className="flex flex-1 flex-col justify-end gap-5"
                  style={{
                    transform: isOpen || reduce ? "none" : "translateY(20px)",
                    transition: reduce
                      ? undefined
                      : `transform ${SWEEP_MS}ms ${SWEEP_EASE}`,
                  }}
                >
                  <p className="text-[clamp(1rem,1.5vw,1.375rem)] font-medium text-white/75">
                    {machine.role}
                  </p>
                  <h2 className="max-w-[12ch] font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-white">
                    {machine.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                      href={`/machines/${machine.slug}`}
                      className="group inline-flex items-center gap-2 text-[clamp(1rem,1.5vw,1.25rem)] font-semibold text-white underline-offset-8 hover:underline"
                    >
                      Learn more
                      <ArrowUpRight
                        size={20}
                        weight="bold"
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                      />
                    </Link>
                    <Link
                      href="#compare"
                      className="text-[clamp(0.9375rem,1.3vw,1.125rem)] text-white/70 underline-offset-8 transition-colors hover:text-white hover:underline"
                    >
                      Compare all three
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
