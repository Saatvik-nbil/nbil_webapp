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
      /* A column on small screens: the copy card, then the wipe beneath it.
         The bottom padding clears MobileStickyCTA, which is fixed to the
         bottom of the viewport below sm. From lg up this is the full-bleed
         hero it has always been. */
      className="relative isolate overflow-hidden bg-[var(--color-photo-ground)] flex flex-col justify-center gap-6 pt-24 pb-24 sm:pb-16 lg:flex-row lg:items-center lg:gap-0 lg:min-h-svh lg:pt-20 lg:pb-0"
    >
      {/* Manual CAD to G-code to print wipe. All three frames leave their left
          third as plain background, which is where the copy panel sits from lg
          up, so the window's travel is clamped to the right of the frame.

          Below lg the wipe is its own card under the copy rather than the
          backdrop behind it: full width it sat almost entirely behind the
          panel, so the reader was being asked to drag something they could not
          see. The sources are 16:9, so an aspect-video card crops nothing and
          the composition matches the desktop one exactly. It stays first in
          the DOM so that from lg up it paints under the copy. */}
      <div className="order-last relative mx-6 aspect-video overflow-hidden rounded-[1.5rem] ring-1 ring-white/15 lg:order-none lg:absolute lg:inset-0 lg:mx-0 lg:aspect-auto lg:rounded-none lg:ring-0">
        <ScaffoldStageCompare />
      </div>

      {/* Click-through except for the panel itself. Containing the wipe's
          chrome inside its own frame means this wrapper now paints above it,
          and from lg up the grid's empty right column lies right over the
          handle: without this it would swallow the drag. */}
      <div className="pointer-events-none relative max-w-7xl mx-auto px-6 py-0 lg:py-16 w-full">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          {/* From lg up the copy sits on frosted glass over the wipe's
              plain-background side. The fill is a diagonal gradient rather
              than a flat wash: brighter at the top-left corner where the
              heading sits, thinner through the middle so the silk reads
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
            </div>
          </LiquidGlass>

          {/* Right slot stays clear so the wipe reads through */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
