"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CatalogHero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blurred, setBlurred] = useState(false); // freeze + blur on the end frame
  const [revealed, setRevealed] = useState(false); // overlay copy visible

  // Orchestrate the intro: play once → blur end frame → pop the copy.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduce) {
      video.pause();
      setRevealed(true);
      return;
    }

    const onEnded = () => {
      setBlurred(true);
      setRevealed(true);
    };
    video.addEventListener("ended", onEnded);

    // The clip may already have finished before hydration attached the listener.
    if (video.ended) {
      onEnded();
    } else {
      // If autoplay is blocked, don't trap the copy behind a clip that never plays.
      video.play().catch(() => {
        setRevealed(true);
      });
    }

    // Safety net in case the 'ended' event never fires.
    const fallback = setTimeout(() => setRevealed(true), 9000);

    return () => {
      video.removeEventListener("ended", onEnded);
      clearTimeout(fallback);
    };
  }, [reduce]);

  // The copy mounts only after the intro clip finishes, so each line animates
  // from its initial state to visible on mount — a reliable staggered pop.
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
      {/* Background video, inset below the navbar so the two never overlap */}
      <video
        ref={videoRef}
        className="absolute inset-x-0 bottom-0 top-[84px] object-cover sm:top-[92px]"
        style={{
          filter: blurred ? "blur(18px)" : "blur(0px)",
          transform: blurred ? "scale(1.08)" : "scale(1)",
          transformOrigin: "center top",
          transition: "filter 900ms ease, transform 900ms ease",
        }}
        src="/images/explore.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Solid dark cap keeps the strip behind the navbar black — as at the
          start — even once the end frame blurs and scales up */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[84px] bg-[var(--color-dark-bg)] sm:h-[92px]"
      />
      {/* Seam blend softens the video's top edge below the cap */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[84px] z-[1] h-24 bg-gradient-to-b from-[var(--color-dark-bg)] to-transparent sm:top-[92px]"
      />
      {/* Bottom scrim anchors the copy once it appears */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
      />

      {/* Overlay copy */}
      <div className="relative w-full">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-40 lg:pb-24">
          {revealed && (
          <div className="flex max-w-[60ch] flex-col gap-6">
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
              pellet and light-based bioprinting. Explore every bioprinter, spec for spec.
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
          )}
        </div>
      </div>

    </section>
  );
}
