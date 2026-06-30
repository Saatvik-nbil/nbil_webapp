"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { LinkedinLogo, YoutubeLogo, ArrowUpRight } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Editorial carousel — event photos from /public/events ───────────────
   Add or swap images by editing these arrays; mixed aspect ratios echo an
   editorial wall. */
type Slot = { aspect: string; src: string; alt?: string };

const ROW_TOP: Slot[] = [
  { aspect: "4 / 5", src: "/events/1.JPG" },
  { aspect: "16 / 10", src: "/events/2.jpg" },
  { aspect: "3 / 4", src: "/events/3.jpg" },
  { aspect: "4 / 3", src: "/events/4.jpg" },
  { aspect: "5 / 6", src: "/events/5.JPG" },
  { aspect: "16 / 9", src: "/events/6.JPG" },
];

const ROW_BOTTOM: Slot[] = [
  { aspect: "16 / 10", src: "/events/7.JPG" },
  { aspect: "3 / 4", src: "/events/8.JPG" },
  { aspect: "4 / 3", src: "/events/2.jpg" },
  { aspect: "4 / 5", src: "/events/4.jpg" },
  { aspect: "16 / 9", src: "/events/6.JPG" },
  { aspect: "3 / 4", src: "/events/5.JPG" },
];

/* ── YouTube — podcast features & talks (channel: @nextbiglearning6504) ── */
const VIDEOS: { id: string; title: string }[] = [
  { id: "90fK44sd-yQ", title: "NBIL feature — podcast 1" },
  { id: "YxpZTNFlVAQ", title: "NBIL feature — podcast 2" },
  { id: "IK8dIz7xxGg", title: "NBIL feature — podcast 3" },
  { id: "7rTGcRriepI", title: "NBIL feature — podcast 4" },
];

/* ── LinkedIn embeds — heights match LinkedIn's published embed sizes ──── */
const POSTS: { id: string; height: number }[] = [
  { id: "7472211153843048448", height: 1049 },
  { id: "7459948340193951745", height: 1259 },
  { id: "7462436032752345088", height: 902 },
  { id: "7440000685158572033", height: 1259 },
  { id: "7409193530944000000", height: 902 },
];

function PhotoCard({ slot, heightClass }: { slot: Slot; heightClass: string }) {
  return (
    <div
      className={`relative ${heightClass} shrink-0 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)]`}
      style={{ aspectRatio: slot.aspect }}
    >
      <Image
        src={slot.src}
        alt={slot.alt ?? "Next Big Innovation Labs event"}
        fill
        sizes="(max-width: 768px) 240px, 320px"
        className="object-cover"
      />
    </div>
  );
}

function MarqueeRow({
  slots,
  direction,
  heightClass,
  duration,
}: {
  slots: Slot[];
  direction: "left" | "right";
  heightClass: string;
  duration: number;
}) {
  const loop = [...slots, ...slots];
  return (
    <div className="flex w-max">
      <div
        className={`flex shrink-0 gap-4 pr-4 md:gap-5 md:pr-5 ${
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((slot, i) => (
          <PhotoCard key={i} slot={slot} heightClass={heightClass} />
        ))}
      </div>
    </div>
  );
}

export default function NewsLanding() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { delay, duration: 0.6, ease: EASE },
        };

  return (
    <main id="main-content" className="bg-[var(--color-canvas)]">
      {/* ── Header ── */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-10 lg:pt-40 lg:pb-14">
        <motion.p
          {...rise(0)}
          className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]"
        >
          News
        </motion.p>
        <motion.h1
          {...rise(0.06)}
          className="mt-4 max-w-[18ch] font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] sm:text-[3.25rem] lg:text-[3.75rem]"
        >
          What we&rsquo;re building, in the open
        </motion.h1>
        <motion.p
          {...rise(0.12)}
          className="mt-5 max-w-[58ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]"
        >
          Moments from the lab and the field, podcast features and talks, and the
          latest straight from our LinkedIn.
        </motion.p>
      </section>

      {/* ── 1. Editorial carousel (full-bleed, opposing directions) ── */}
      <section aria-label="Event gallery" className="relative overflow-hidden py-6 lg:py-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-canvas)] to-transparent lg:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-canvas)] to-transparent lg:w-28" />

        <div className="flex flex-col gap-4 md:gap-5">
          <MarqueeRow slots={ROW_TOP} direction="left" heightClass="h-[180px] sm:h-[230px] md:h-[290px]" duration={64} />
          <MarqueeRow slots={ROW_BOTTOM} direction="right" heightClass="h-[180px] sm:h-[230px] md:h-[290px]" duration={56} />
        </div>
      </section>

      {/* ── 2. Podcast features & talks (YouTube) ── */}
      <section
        aria-labelledby="watch-heading"
        className="border-t border-[var(--color-hairline)] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            {...rise(0)}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                <YoutubeLogo size={18} weight="fill" />
                Watch &amp; listen
              </span>
              <h2
                id="watch-heading"
                className="max-w-[22ch] font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[2.5rem]"
              >
                Podcast features &amp; talks
              </h2>
            </div>
            <a
              href="https://www.youtube.com/@nextbiglearning6504"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-xl border border-[var(--color-hairline)] px-5 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand-strong)] sm:self-auto"
            >
              Visit our channel
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </motion.div>

          {/* Scroll feed — reveals more than 4 by scrolling */}
          <div className="relative mt-10">
            <div
              data-lenis-prevent
              className="max-h-[760px] overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {VIDEOS.map((v) => (
                  <div
                    key={v.id}
                    className="overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
                  >
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.id}`}
                        title={v.title}
                        className="h-full w-full"
                        frameBorder={0}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[var(--color-canvas)] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── 3. Recent from NBIL (LinkedIn embeds) ── */}
      <section
        aria-labelledby="recent-heading"
        className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            {...rise(0)}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                <LinkedinLogo size={16} weight="fill" />
                Recent from NBIL
              </span>
              <h2
                id="recent-heading"
                className="max-w-[20ch] font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[2.5rem]"
              >
                Straight from our feed
              </h2>
            </div>
            <a
              href="https://www.linkedin.com/company/next-big-innovation-labs/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-xl border border-[var(--color-hairline)] px-5 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)] hover:text-[var(--color-brand-strong)] sm:self-auto"
            >
              Follow on LinkedIn
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </motion.div>

          {/* Scroll feed — masonry that scrolls once past the first few posts */}
          <div className="relative mt-10">
            <div
              data-lenis-prevent
              className="max-h-[1400px] overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
            >
              <div className="[column-gap:1.5rem] columns-[460px]">
                {POSTS.map((post) => (
                  <div
                    key={post.id}
                    className="mx-auto mb-6 max-w-[504px] break-inside-avoid overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
                  >
                    <iframe
                      src={`https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${post.id}`}
                      height={post.height}
                      width={504}
                      className="block w-full"
                      frameBorder={0}
                      allowFullScreen
                      loading="lazy"
                      title={`LinkedIn post ${post.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
