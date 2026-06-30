"use client";

import { motion, useReducedMotion } from "motion/react";
import { ImageSquare, LinkedinLogo, ArrowUpRight } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Carousel placeholders ──────────────────────────────────────────────
   Swap each `src: undefined` for an image path later; the card renders a
   placeholder until then. Aspect ratios are mixed to echo an editorial wall. */
type Slot = { aspect: string; src?: string; alt?: string };

const ROW_TOP: Slot[] = [
  { aspect: "4 / 5" },
  { aspect: "16 / 10" },
  { aspect: "3 / 4" },
  { aspect: "4 / 3" },
  { aspect: "5 / 6" },
  { aspect: "16 / 9" },
];

const ROW_BOTTOM: Slot[] = [
  { aspect: "16 / 10" },
  { aspect: "3 / 4" },
  { aspect: "4 / 3" },
  { aspect: "4 / 5" },
  { aspect: "16 / 9" },
  { aspect: "3 / 4" },
];

/* ── LinkedIn embeds ────────────────────────────────────────────────────
   Heights match LinkedIn's published embed sizes for these posts. */
const POSTS: { id: string; height: number }[] = [
  { id: "7472211153843048448", height: 1049 },
  { id: "7459948340193951745", height: 1259 },
  { id: "7462436032752345088", height: 902 },
  { id: "7440000685158572033", height: 1259 },
  { id: "7409193530944000000", height: 902 },
];

const TINTS = [
  "from-[var(--color-brand-surface)] to-[var(--color-surface)]",
  "from-[#eef2f7] to-[var(--color-surface)]",
  "from-[#f0f6fe] to-[#e8f1fd]",
  "from-[#f4f5f7] to-[var(--color-surface-raised)]",
];

function PlaceholderCard({
  slot,
  idx,
  heightClass,
}: {
  slot: Slot;
  idx: number;
  heightClass: string;
}) {
  return (
    <div
      className={`relative ${heightClass} shrink-0 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-gradient-to-br ${TINTS[idx % TINTS.length]}`}
      style={{ aspectRatio: slot.aspect }}
    >
      {slot.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slot.src}
          alt={slot.alt ?? ""}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <ImageSquare size={28} weight="duotone" className="text-[var(--color-ink-faint)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-faint)]">
            Soon
          </span>
        </div>
      )}
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
          <PlaceholderCard key={i} slot={slot} idx={i} heightClass={heightClass} />
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
          Press, milestones and moments from the lab — and the latest straight from
          our LinkedIn.
        </motion.p>
      </section>

      {/* ── Editorial carousel (full-bleed, opposing directions) ── */}
      <section aria-label="In the press" className="relative overflow-hidden py-6 lg:py-10">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-canvas)] to-transparent lg:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-canvas)] to-transparent lg:w-28" />

        <div className="flex flex-col gap-4 md:gap-5">
          <MarqueeRow slots={ROW_TOP} direction="left" heightClass="h-[180px] sm:h-[230px] md:h-[290px]" duration={64} />
          <MarqueeRow slots={ROW_BOTTOM} direction="right" heightClass="h-[180px] sm:h-[230px] md:h-[290px]" duration={56} />
        </div>
      </section>

      {/* ── Recent from NBIL (LinkedIn embeds) ── */}
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

          {/* Masonry of embeds — columns size to LinkedIn's native ~504px */}
          <div className="mt-10 [column-gap:1.5rem] columns-[460px]">
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
      </section>
    </main>
  );
}
