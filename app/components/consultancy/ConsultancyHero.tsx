"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Star, ArrowRight, CalendarCheck } from "@phosphor-icons/react";
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
      className="relative isolate overflow-hidden bg-[var(--color-dark-bg)] min-h-[92svh] flex items-center pt-20"
    >
      {/* Cinematic bioprinter background, desaturated to a dark silhouette,
          framed toward the right so it clears the copy panel on the left */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover [object-position:78%_center] lg:[object-position:70%_center]"
        style={{ filter: "grayscale(1) brightness(0.55) contrast(1.1)" }}
        src="/videos/bioprinter-consultancy.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Scrim: keeps the printer visible on the right, blends into a
          readable dark field toward the left where the copy sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,20,34,0.94) 0%, rgba(10,20,34,0.82) 38%, rgba(10,20,34,0.35) 62%, rgba(10,20,34,0.15) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-transparent to-[var(--color-dark-bg)]/40"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Copy, glass-blended over the video */}
          <LiquidGlass
            tint="light"
            distort={false}
            className="rounded-[2rem] border border-white/15 shadow-[0_24px_70px_rgba(2,8,20,0.45)]"
          >
            <div className="flex flex-col p-8 sm:p-10 lg:p-12">
              <motion.h1
                {...rise(0.06)}
                id="consultancy-hero-heading"
                className="font-display text-[clamp(2.4rem,5.5vw,4rem)] font-bold tracking-[-0.035em] text-white leading-[0.98]"
              >
                Bioprinting
                <br />
                Services
              </motion.h1>
              <motion.p
                {...rise(0.12)}
                className="mt-6 text-[17px] lg:text-[18px] text-white/75 leading-relaxed max-w-[46ch]"
              >
                Thinking about getting started? Or still weighing your options?
                Schedule a free session with our specialists.
              </motion.p>
              <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-4">
                <OriginButton href="#project-form" className="px-6 font-semibold">
                  <CalendarCheck size={18} weight="bold" />
                  Book Now
                </OriginButton>
                <OriginButton
                  href="#process"
                  variant="outline"
                  className="border-white/25 bg-white/5 px-6 font-semibold text-white"
                >
                  How it works
                  <ArrowRight size={16} weight="bold" />
                </OriginButton>
              </motion.div>

              {/* Trust line, folded into the same glass panel */}
              <motion.div
                {...rise(0.3)}
                className="mt-8 flex items-center gap-3 border-t border-white/15 pt-6"
              >
                <div className="flex items-center gap-0.5 text-[var(--color-brand)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} weight="fill" />
                  ))}
                </div>
                <p className="text-[13px] text-white/70 leading-relaxed">
                  <span className="font-semibold text-white">Trusted by IIT Roorkee</span>
                  &nbsp;&mdash; &ldquo;Developed complex cortical bone architecture
                  using Trivima.&rdquo;
                </p>
              </motion.div>
            </div>
          </LiquidGlass>

          {/* Right slot stays clear so the printer reads through the video */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
