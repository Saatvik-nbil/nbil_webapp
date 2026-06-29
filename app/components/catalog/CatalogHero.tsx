"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  Pause,
  Play,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CatalogHero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [blurred, setBlurred] = useState(false); // freeze + blur on the end frame
  const [revealed, setRevealed] = useState(false); // overlay copy visible

  // Orchestrate the intro: play once → blur end frame → pop the copy.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduce) {
      video.pause();
      setPlaying(false);
      setRevealed(true);
      return;
    }

    const onEnded = () => {
      setBlurred(true);
      setPlaying(false);
      setRevealed(true);
    };
    video.addEventListener("ended", onEnded);

    // The clip may already have finished before hydration attached the listener.
    if (video.ended) {
      onEnded();
    } else {
      // If autoplay is blocked, don't trap the copy behind a clip that never plays.
      video.play().catch(() => {
        setPlaying(false);
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

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (blurred) {
        // Replay the intro from the top.
        setBlurred(false);
        video.currentTime = 0;
      }
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
  };

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
            <motion.p
              {...pop(0)}
              className="text-[13px] font-semibold tracking-tight text-[var(--color-dark-brand)]"
            >
              The full Trivima range, by Next Big Innovation Labs
            </motion.p>

            <motion.h1
              id="hero-heading"
              {...pop(1)}
              className="font-display text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-[3.25rem] lg:text-[4.25rem]"
            >
              Bioprinters built to match the geometry of biology.
            </motion.h1>

            <motion.p
              {...pop(2)}
              className="max-w-[54ch] text-[1.0625rem] leading-relaxed text-white/75"
            >
              From a non-planar rotary system to a six-extruder research flagship and
              a light-based platform, the Trivima family spans extrusion, inkjet,
              pellet and light-based bioprinting. Explore every machine, spec for spec.
            </motion.p>

            <motion.div {...pop(3)} className="mt-1 flex flex-wrap items-center gap-3">
              <Link
                href="#models"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-brand-hover)]"
              >
                Explore the models
                <ArrowDown weight="bold" size={17} />
              </Link>
              <Link
                href="#compare"
                className="inline-flex h-11 items-center rounded-xl border border-white/25 bg-white/10 px-6 text-[15px] font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Compare specs
              </Link>
            </motion.div>

            {/* Key facts */}
            <motion.p
              {...pop(4)}
              className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/15 pt-6 text-[14px] text-white/70"
            >
              <span><strong className="font-semibold text-white">Three models</strong></span>
              <span aria-hidden="true" className="text-white/35">·</span>
              <span>extrusion, inkjet, pellet and light</span>
              <span aria-hidden="true" className="text-white/35">·</span>
              <span>down to <strong className="font-semibold text-white">10&nbsp;µm</strong></span>
              <span aria-hidden="true" className="text-white/35">·</span>
              <span>eight years in research labs</span>
            </motion.p>
          </div>
          )}
        </div>
      </div>

      {/* Glass playback controls */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause background video" : blurred ? "Replay intro video" : "Play background video"}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute background video" : "Mute background video"}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
        >
          {muted ? (
            <SpeakerSimpleSlash size={16} weight="fill" />
          ) : (
            <SpeakerSimpleHigh size={16} weight="fill" />
          )}
        </button>
      </div>
    </section>
  );
}
