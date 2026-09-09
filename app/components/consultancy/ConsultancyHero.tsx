"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck } from "@phosphor-icons/react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { OriginButton } from "@/components/ui/origin-button";
import ModelCompare from "@/app/components/consultancy/ModelCompare";

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
      className="relative isolate overflow-hidden bg-[var(--color-photo-ground)] min-h-svh flex items-center pt-20"
    >
      {/* Manual CAD to G-code to print wipe. All three frames leave their left
          third as plain background, which is where the copy panel sits, so the
          window's travel is clamped to the right of the frame. */}
      <ModelCompare />

      {/* A light wash over the whole frame so the copy panel has something to
          sit against without flattening either image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(10,20,34,0.12)]"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 w-full">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          {/* Copy sits on frosted glass over the comparison's plain-background
              side. The fill is a diagonal gradient rather than a flat wash:
              brighter at the top-left corner where the heading sits, thinner
              through the middle so the silk reads through the panel, which is
              what makes it look like glass rather than a translucent box. */}
          <LiquidGlass
            tint="light"
            className="rounded-[2rem] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.34)_52%,rgba(255,255,255,0.46)_100%)] shadow-[0_24px_70px_rgba(2,8,20,0.30)]"
          >
            <div className="flex flex-col p-8 sm:p-10 lg:p-12">
              <motion.p
                {...rise(0.02)}
                className="italic text-[13px] lg:text-[14px] text-[var(--color-ink)]/65 leading-[1.5]"
              >
                A Decade of Bioprinting Engineering &amp; Advisory
              </motion.p>
              <motion.h1
                {...rise(0.06)}
                id="consultancy-hero-heading"
                className="mt-3 font-display text-[clamp(1.85rem,3.5vw,2.85rem)] font-bold tracking-[-0.03em] text-[var(--color-ink)] leading-[1.06] max-w-[19ch]"
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

          {/* Right slot stays clear so the reel reads through the video */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
