"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import type { Publication } from "@/lib/publications";

/**
 * The papers as a shelf you push through, one card at a time.
 *
 * Each card carries the paper's own first page, so the row reads as a stack of
 * reprints rather than a list of links. The track is a native scroll-snap
 * container (no carousel library): the arrows just scroll it by one card, so
 * trackpad swipes, keyboard scrolling and touch all keep working for free.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Muted tints, cycled so neighbouring cards never repeat. All four sit in the
 *  same blue-slate family as the rest of the site, so the shelf still reads as
 *  one system rather than a paint chart. */
const TINTS = [
  "from-[#e8f0ff] to-[#d7e5ff]",
  "from-[#eef1f6] to-[#dee5ef]",
  "from-[#e9f4f1] to-[#d8eae5]",
  "from-[#f1eefb] to-[#e3dbf6]",
];

const cardNumber = (i: number) => String(i + 1).padStart(3, "0");

export default function PublicationsCarousel({
  publications,
  onOpen,
}: {
  publications: Publication[];
  onOpen: (pub: Publication) => void;
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // A pixel of slack: sub-pixel scroll widths would otherwise leave the
    // arrow enabled at the very end of the track.
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    // Card width plus the gap, so a press lands the next card flush left.
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex items-end justify-between gap-6 px-6">
        <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--color-ink-muted)]">
          Open a paper for how the machine was used and the abstract as published.
        </p>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous papers"
            className="flex size-11 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)] disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft size={17} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="More papers"
            className="flex size-11 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)] disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight size={17} weight="bold" />
          </button>
        </div>
      </div>

      {/* Track. Padded by a full gutter so the first and last cards line up with
          the page margin while still scrolling edge to edge. */}
      <ul
        ref={trackRef}
        role="list"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {publications.map((pub, i) => (
          <motion.li
            key={pub.slug}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: Math.min(i, 3) * 0.08, duration: 0.55, ease: EASE }}
            className="w-[82vw] shrink-0 snap-start sm:w-[380px] lg:w-[400px]"
          >
            <button
              type="button"
              onClick={() => onOpen(pub)}
              aria-haspopup="dialog"
              className={`group relative flex h-[500px] w-full flex-col overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-gradient-to-b text-left transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-[var(--color-brand)] hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                TINTS[i % TINTS.length]
              }`}
            >
              {/* Index and the machine it was printed on */}
              <div className="flex items-start justify-between gap-3 px-6 pt-6">
                <span className="text-[11.5px] tracking-[0.22em] text-[var(--color-ink-faint)]">
                  ( {cardNumber(i)} )
                </span>
                <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-brand-strong)]">
                  {pub.machine}
                </span>
              </div>

              {/* The paper itself, cropped to its masthead and title block */}
              <div className="relative mx-6 mt-5 flex-1 overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.10)]">
                <Image
                  src={pub.thumb}
                  alt={`First page of ${pub.title}`}
                  width={760}
                  height={983}
                  sizes="(max-width: 640px) 82vw, 400px"
                  className="absolute inset-x-0 top-0 w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent"
                />
              </div>

              {/* Citation and title */}
              <div className="flex flex-col gap-2 px-6 pb-6 pt-5">
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  <span className="text-[var(--color-brand-strong)]">{pub.journal}</span>
                  <span aria-hidden="true">·</span>
                  <span>{pub.year}</span>
                </div>
                <h3 className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.015em] text-[var(--color-ink)] line-clamp-3">
                  {pub.title}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-brand-strong)]">
                  Read the abstract
                  <ArrowUpRight
                    size={14}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  />
                </span>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
