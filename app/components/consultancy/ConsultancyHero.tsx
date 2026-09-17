"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck } from "@phosphor-icons/react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { OriginButton } from "@/components/ui/origin-button";
import EarStageCompare from "@/app/components/shared/EarStageCompare";
import BrandDots from "@/app/components/shared/BrandDots";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ConsultancyHero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: EASE },
        };

  return (
    <section
      aria-labelledby="consultancy-hero-heading"
      /* A column on small screens: the copy card, then the wipe beneath it.
         The bottom padding clears MobileStickyCTA, which is fixed to the
         bottom of the viewport below sm. From lg up this is the full-bleed
         hero it has always been. */
      className="relative isolate overflow-hidden bg-[var(--color-photo-ground)] flex flex-col justify-center gap-6 pt-24 pb-24 sm:pb-16 lg:flex-row lg:items-center lg:gap-0 lg:min-h-svh lg:pt-20 lg:pb-0"
    >
      {/* Manual CAD to toolpath to print wipe. All three frames leave their
          left third as plain background, which is where the copy panel sits
          from lg up, so the window's travel is clamped to the right of the
          frame.

          Below lg the wipe is its own card under the copy rather than the
          backdrop behind it: full width it sat almost entirely behind the
          panel, so the reader was being asked to drag something they could not
          see. The sources are 16:9, so an aspect-video card crops nothing and
          the composition matches the desktop one exactly. It stays first in
          the DOM so that from lg up it paints under the copy. */}
      <div className="order-last relative mx-6 aspect-video overflow-hidden rounded-[1.5rem] ring-1 ring-white/15 lg:order-none lg:absolute lg:inset-0 lg:mx-0 lg:aspect-auto lg:rounded-none lg:ring-0">
        <EarStageCompare />
      </div>

      {/* Click-through except for the panel itself. Containing the wipe's
          chrome inside its own frame means this wrapper now paints above it,
          and from lg up the grid's empty right column lies right over the
          handle: without this it would swallow the drag. */}
      <div className="pointer-events-none relative max-w-7xl mx-auto px-6 py-0 lg:py-16 w-full">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          {/* From lg up the copy sits on frosted glass over the comparison's
              plain-background side. The fill is a diagonal gradient rather
              than a flat wash: brighter at the top-left corner where the
              heading sits, thinner through the middle so the grid reads
              through the panel, which is what makes it look like glass rather
              than a translucent box.

              Below lg there is no wipe behind it, only flat photo-ground, and
              a translucent fill over a solid colour reads as a grey box. So
              the panel goes near-opaque white there, which keeps every ink
              colour on it exactly as tuned. */}
          <LiquidGlass
            tint="light"
            className="pointer-events-auto rounded-[1.5rem] border border-white/55 bg-[rgba(255,255,255,0.92)] shadow-[0_24px_70px_rgba(2,8,20,0.30)] lg:rounded-[2rem] lg:bg-transparent lg:bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.34)_52%,rgba(255,255,255,0.46)_100%)]"
          >
            <div className="flex flex-col p-6 sm:p-10 lg:p-12">
              <motion.div {...rise(0.01)} className="mb-6">
                <BrandDots />
              </motion.div>
              <motion.p
                {...rise(0.02)}
                className="italic text-[13px] lg:text-[14px] text-[var(--color-ink)]/65 leading-[1.5]"
              >
                A Decade of Bioprinting Engineering &amp; Advisory
              </motion.p>
              <motion.h1
                {...rise(0.06)}
                id="consultancy-hero-heading"
                className="h1 mt-3 max-w-[19ch]"
              >
                Your Bioprinting Project, Handled Start to Finish.
              </motion.h1>
              <motion.p
                {...rise(0.14)}
                className="mt-5 text-[16px] lg:text-[17px] text-[var(--color-ink)]/80 leading-[1.65] max-w-[52ch]"
              >
                Design engineering, biomaterial optimization, and print protocol
                development, run by the same team that builds Trivima itself.
              </motion.p>
              <motion.div {...rise(0.22)} className="mt-8 flex flex-wrap items-center gap-4">
                <OriginButton href="#project-form" className="px-6 font-semibold">
                  <CalendarCheck size={18} weight="bold" />
                  Schedule a call
                </OriginButton>
                <OriginButton
                  href="#process"
                  variant="outline"
                  className="px-6 font-semibold"
                >
                  How it works
                  <ArrowRight size={16} weight="bold" />
                </OriginButton>
              </motion.div>
            </div>
          </LiquidGlass>

          {/* Right slot stays clear so the wipe reads through */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
