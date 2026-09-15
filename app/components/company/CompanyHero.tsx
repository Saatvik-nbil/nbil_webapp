"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

import { LiquidGlass } from "@/components/ui/liquid-glass";
import { OriginButton } from "@/components/ui/origin-button";
import ScaffoldStageCompare from "@/app/components/shared/ScaffoldStageCompare";
import BrandDots from "@/app/components/shared/BrandDots";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = ["We", "set", "out", "to", "print", "a", "better", "future."];

export default function CompanyHero() {
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
      aria-labelledby="company-hero-heading"
      className="relative isolate overflow-hidden bg-[var(--color-photo-ground)] min-h-svh flex items-center pt-20"
    >
      {/* Manual CAD to G-code to print wipe. All three frames leave their left
          third as plain background, which is where the copy panel sits, so the
          window's travel is clamped to the right of the frame. */}
      <ScaffoldStageCompare />

      {/* A light wash over the whole frame so the copy panel has something to
          sit against without flattening any of the three stages. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(10,20,34,0.12)]"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 w-full">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          {/* Copy sits on frosted glass over the wipe's plain-background side.
              The fill is a diagonal gradient rather than a flat wash: brighter
              at the top-left corner where the heading sits, thinner through
              the middle so the silk reads through the panel, which is what
              makes it look like glass rather than a translucent box. */}
          <LiquidGlass
            tint="light"
            className="rounded-[2rem] border border-white/55 bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.34)_52%,rgba(255,255,255,0.46)_100%)] shadow-[0_24px_70px_rgba(2,8,20,0.30)]"
          >
            <div className="flex flex-col p-8 sm:p-10 lg:p-12">
              <motion.div {...rise(0.02)}>
                <BrandDots />
              </motion.div>

              {/* Word by word, each one riding up out of its own clipped box.
                  The screen-reader copy is the whole sentence in one piece so
                  it is never read as eight fragments. */}
              <h1
                id="company-hero-heading"
                className="h1 mt-6"
              >
                <span className="sr-only">
                  We set out to print a better future.
                </span>
                <span aria-hidden="true" className="flex flex-wrap gap-x-[0.26em]">
                  {HEADLINE.map((word, i) => (
                    <span
                      key={i}
                      className="inline-block overflow-hidden py-[0.03em]"
                    >
                      <motion.span
                        className="inline-block"
                        /* Amber carried this word on navy; against the panel
                           it drops to 1.7:1, so the accent falls back to the
                           brand blue. */
                        style={
                          word === "future."
                            ? { color: "var(--color-brand)" }
                            : undefined
                        }
                        initial={reduce ? false : { y: "115%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.85,
                          ease: EASE,
                          delay: 0.15 + i * 0.055,
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </span>
              </h1>

              <motion.p
                {...rise(0.5)}
                className="mt-5 text-[16px] lg:text-[17px] text-[var(--color-ink)]/80 leading-[1.65] max-w-[52ch]"
              >
                Since 2016 we have built the bioprinters and bioprinting
                software researchers and clinicians rely on to model disease,
                develop drugs and engineer living tissue.
              </motion.p>

              <motion.div
                {...rise(0.58)}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <OriginButton href="/trivima" className="px-6 font-semibold">
                  Explore the bioprinters
                  <ArrowRight size={16} weight="bold" />
                </OriginButton>
                <OriginButton
                  href="#connect"
                  variant="outline"
                  className="px-6 font-semibold"
                >
                  Partner with us
                </OriginButton>
              </motion.div>

              <motion.p
                {...rise(0.66)}
                className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-[var(--color-ink)]/15 pt-6 text-[13px] text-[var(--color-ink)]/75"
              >
                <span className="font-semibold text-[var(--color-ink)]">
                  World Economic Forum Technology Pioneer
                </span>
                <span aria-hidden className="text-[var(--color-ink)]/35">
                  ·
                </span>
                <span>Bioprinters installed worldwide</span>
              </motion.p>
            </div>
          </LiquidGlass>

          {/* Right slot stays clear so the wipe reads through */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
