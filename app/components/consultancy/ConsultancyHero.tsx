"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck } from "@phosphor-icons/react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ConsultancyHero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduce) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  }, [reduce]);

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
      className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] min-h-svh flex items-center pt-20"
    >
      {/* Work reel: a six-cell montage of prints and machines. Held under a
          light gaussian blur so it reads as colour and movement behind the
          copy rather than six competing subjects; scaled past full bleed
          because a blur samples past its own edges and would otherwise leave
          a soft border. A light wash sits over it, with the copy on its own
          light card rather than relying on a heavy tint for contrast. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ filter: "blur(4px)", transform: "scale(1.04)" }}
        src="/images/HeroSection.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* A light black wash: just enough to settle the brightest cells of the
          reel and give the copy card an edge to sit against, not enough to
          read as a dark overlay. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[rgba(0,0,0,0.2)]"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16 w-full">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          {/* Copy sits on a light card: the reel underneath runs untinted, so
              the panel supplies its own ground and the type stays black. */}
          <LiquidGlass
            tint="light"
            distort={false}
            className="rounded-[2rem] border border-white/60 bg-white/85 shadow-[0_24px_70px_rgba(2,8,20,0.28)] backdrop-blur-xl"
          >
            <div className="flex flex-col p-8 sm:p-10 lg:p-12">
              <motion.h1
                {...rise(0.06)}
                id="consultancy-hero-heading"
                className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.04em] text-[var(--color-ink)] leading-[0.92]"
              >
                Bioprinting
                <br />
                <span className="block text-[0.62em] tracking-[-0.035em] leading-[1.02]">
                  Engineered With You
                </span>
              </motion.h1>
              <motion.p
                {...rise(0.12)}
                className="mt-5 font-display text-[17px] lg:text-[19px] font-semibold tracking-[-0.015em] text-[var(--color-ink)]"
              >
                From Protocol to Print. We Build It With You.
              </motion.p>
              <motion.p
                {...rise(0.16)}
                className="mt-5 text-[16px] lg:text-[17px] text-[var(--color-ink-muted)] leading-[1.65] max-w-[52ch]"
              >
                Every scaffold, every parameter, every decision, visible to you,
                at every stage, from first sketch to final print.
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
