"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";
import { LiquidGlass } from "@/components/ui/liquid-glass";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CatalogHero() {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false); // overlay copy visible

  // The old video hero played once, then popped the copy on "ended". A static
  // photo has no playback to wait on: reduced motion reveals instantly,
  // otherwise a short beat lets the image settle before the copy pops in.
  useEffect(() => {
    if (reduce) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 350);
    return () => clearTimeout(t);
  }, [reduce]);

  // The copy mounts only once `revealed` flips true, so each line animates
  // from its initial state to visible on mount, a reliable staggered pop.
  const pop = (i: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
          transition: { delay: 0.1 + i * 0.09, duration: 0.6, ease: EASE },
        };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--color-dark-bg)]"
    >
      {/* Background photo, inset below the navbar so the two never overlap.
          Full-bleed, but never cropping the actual product shot: a blurred,
          scaled-up copy fills every edge of the stage (so the section never
          shows bare background), while the sharp copy on top sits at
          object-contain: always the complete photo, all three machines,
          whatever the viewport's aspect ratio. */}
      <div className="absolute inset-x-0 bottom-0 top-[84px] sm:top-[92px]">
        <Image
          src="/images/trivima-lineup.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-center opacity-70 blur-3xl"
        />
        <Image
          src="/images/trivima-lineup.jpg"
          alt="The Trivima Pro, NP and Aura bioprinters lined up on a lab bench"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* Solid dark cap keeps the strip behind the navbar black */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[84px] bg-[var(--color-dark-bg)] sm:h-[92px]"
      />
      {/* Seam blend softens the photo's top edge below the cap */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[84px] z-[1] h-24 bg-gradient-to-b from-[var(--color-dark-bg)] to-transparent sm:top-[92px]"
      />
      {/* Bottom scrim anchors the copy once it appears */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
      />

      {/* Overlay copy: glass-blended over the photo, same treatment as the
          consultancy hero's photo-backed copy panel. */}
      <div className="relative w-full">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-40 lg:pb-24">
          {revealed && (
          <LiquidGlass
            tint="light"
            distort={false}
            className="max-w-[42rem] rounded-[2rem] border border-white/15 shadow-[0_24px_70px_rgba(2,8,20,0.45)]"
          >
          <div className="flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
            <motion.h1
              id="hero-heading"
              {...pop(0)}
              className="font-display text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-[3.25rem] lg:text-[4.25rem]"
            >
              Bioprinters built to match the geometry of biology.
            </motion.h1>

            <motion.p
              {...pop(1)}
              className="max-w-[54ch] text-[1.0625rem] leading-relaxed text-white/75"
            >
              From a non-planar rotary bioprinter to a six-extruder research flagship
              and a light-based bioprinter, the Trivima range spans extrusion, inkjet,
              pellet and light-based bioprinting. Every one of them is configured to
              your protocol before it is built: extruders, heads, build volume and
              fixtures. Explore the range, spec for spec.
            </motion.p>

            <motion.div {...pop(2)} className="mt-1 flex flex-wrap items-center gap-3">
              <OriginButton href="#models" className="h-11 px-6 text-[15px]">
                Explore the bioprinters
                <ArrowDown weight="bold" size={17} />
              </OriginButton>
              <OriginButton
                href="#compare"
                variant="outline"
                className="h-11 border-white/25 bg-white/10 px-6 text-[15px] text-white backdrop-blur-md"
              >
                Compare specs
              </OriginButton>
            </motion.div>

            {/* Key facts */}
            <motion.p
              {...pop(3)}
              className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/15 pt-6 text-[14px] text-white/70"
            >
              <span><strong className="font-semibold text-white">Three models</strong></span>
              <span aria-hidden="true" className="text-white/35">·</span>
              <span>
                <strong className="font-semibold text-white">Four bioprinting technologies</strong>:
                Extrusion, Inkjet, Pellet and Light
              </span>
              <span aria-hidden="true" className="text-white/35">·</span>
              <span>Down to <strong className="font-semibold text-white">10&nbsp;µm</strong></span>
              <span aria-hidden="true" className="text-white/35">·</span>
              <span>10 years of bioprinting in research labs</span>
            </motion.p>
          </div>
          </LiquidGlass>
          )}
        </div>
      </div>

    </section>
  );
}
