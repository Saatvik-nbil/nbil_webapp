"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";

import { OriginButton } from "@/components/ui/origin-button";
import { getMachine, type Machine } from "@/lib/machines";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The three colours of the nbil mark, sampled from the logo artwork. Amber
   never carries text: at 1.7:1 on white it is a fill and a graphic only. */
const NBIL = {
  indigo: "#2c30a0",
  magenta: "#c40064",
  amber: "#ffb92b",
} as const;

const HEADLINE = ["We", "set", "out", "to", "print", "a", "better", "future."];

/** How long each machine holds the spotlight, and each print holds the frame. */
const MACHINE_MS = 6000;
const PRINT_MS = 4600;

type Entry = {
  machine: Machine;
  accent: string;
  tint: string;
  labelColor: string;
};

/* Array order is the cycle order: NP, then Aura, then Pro. */
const LINEUP: Entry[] = [
  {
    machine: getMachine("trivima-np")!,
    accent: NBIL.magenta,
    tint: "#fdedf4",
    labelColor: "#96004b",
  },
  {
    machine: getMachine("trivima-aura")!,
    accent: NBIL.amber,
    tint: "#fff4e0",
    labelColor: "#8a5400",
  },
  {
    machine: getMachine("trivima-pro")!,
    accent: NBIL.indigo,
    tint: "#eceffb",
    labelColor: "#23277f",
  },
];

const PRINTS: {
  src: string;
  alt: string;
  caption: string;
  position?: string;
}[] = [
  {
    src: "/images/1.webp",
    alt: "A bioprinted human ear held on a print disc",
    caption: "Bioprinted auricular scaffold",
    position: "45% 50%",
  },
  {
    src: "/images/2.jpeg",
    alt: "An ear scaffold being extruded in orange bioink into a petri dish",
    caption: "Auricular cartilage, mid-print",
    position: "50% 45%",
  },
  {
    src: "/images/7.webp",
    alt: "A bifurcated tubular construct in a petri dish",
    caption: "Bifurcated vascular construct",
    position: "50% 50%",
  },
  {
    src: "/images/5.webp",
    alt: "A clear hydrogel lattice printed into a petri dish",
    caption: "Hydrogel lattice, 5 by 5 grid",
    position: "62% 50%",
  },
  {
    src: "/images/3.webp",
    alt: "The nbil mark bioprinted inside a clear hydrogel cube",
    caption: "The nbil mark, printed in hydrogel",
    position: "58% 50%",
  },
];

const CARD_SHELL =
  "group relative h-full w-full overflow-hidden rounded-[20px] border border-[var(--color-hairline)]";

const CARD_LIFT =
  "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_22px_50px_-18px_rgba(12,22,38,0.28)]";

/* Headline and opening copy in one card: it owns the whole left column, on
   white rather than the old navy panel.

   The card is now three grid rows tall while its content is not, so the slack
   is parked at the bottom instead of being spread by justify-between, which
   opened a hole between the headline and the copy. Everything stacks from the
   top on its own rhythm. */
function IntroCard() {
  const reduce = useReducedMotion();

  return (
    <div
      className={`${CARD_SHELL} flex flex-col bg-[var(--color-surface)] p-7 sm:p-9`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 105% at 94% 2%, var(--color-surface-raised), transparent 62%)",
        }}
      />

      <div aria-hidden="true" className="relative flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: NBIL.amber }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: NBIL.indigo }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: NBIL.magenta }}
        />
      </div>

      <h1
        id="company-hero-heading"
        className="h1 relative mt-6 leading-[1]!"
      >
        <span className="sr-only">We set out to print a better future.</span>
        <span aria-hidden="true" className="flex flex-wrap gap-x-[0.26em]">
          {HEADLINE.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden py-[0.03em]">
              <motion.span
                className="inline-block"
                /* Amber carried this word on navy; on white it drops to
                   1.7:1, so the accent falls back to the brand blue. */
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

      <p className="relative mt-7 max-w-[46ch] text-[15.5px] leading-[1.75] text-[var(--color-ink-muted)]">
        Since 2016 we have built the bioprinters and bioprinting software
        researchers and clinicians rely on to model disease, develop drugs and
        engineer living tissue.
      </p>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
        <OriginButton href="/trivima">
          Explore the bioprinters
          <ArrowRight size={16} weight="bold" />
        </OriginButton>
        <OriginButton href="#connect" variant="outline">
          Partner with us
        </OriginButton>
      </div>
    </div>
  );
}

/* The one detailed machine card. It rotates through the range on its own, and
   the whole surface is a single link to the model it is currently showing. */
function SpotlightCard({
  entry,
  paused,
  onPause,
  onResume,
}: {
  entry: Entry;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
}) {
  const reduce = useReducedMotion();
  const { machine, accent, tint, labelColor } = entry;

  return (
    <div
      className={`${CARD_SHELL} ${CARD_LIFT} bg-[var(--color-surface)]`}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={onResume}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={{ backgroundColor: tint }}
        transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
      />

      {/* draggable={false}: anchors and images start a native browser drag,
          which swallows the pointer on the surrounding card. */}
      <Link
        href={`/machines/${machine.slug}`}
        draggable={false}
        aria-label={`View ${machine.name}`}
        className="absolute inset-0 z-[1] rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
      />

      {/* pointer-events-none: every click belongs to the link underneath. */}
      <div className="pointer-events-none relative z-[2] h-full p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={machine.slug}
            className="flex h-full flex-col"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.022em] text-[var(--color-ink)]">
              {machine.name}
            </h2>

            <span
              className="mt-1.5 inline-flex w-fit items-center gap-2 text-[12.5px] font-semibold"
              style={{ color: labelColor }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
              />
              {machine.role}
            </span>

            <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.6] text-[var(--color-ink-muted)]">
              {machine.blurb}
            </p>

            <div className="relative my-3 min-h-0 flex-1">
              <motion.img
                src={machine.heroImage.src}
                alt={machine.heroImage.alt}
                loading="eager"
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain object-center drop-shadow-[0_16px_32px_rgba(12,22,38,0.24)]"
                initial={reduce ? false : { scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
              />
            </div>

            <dl className="grid gap-1.5 border-t border-[var(--color-hairline)] pt-3.5">
              {machine.stats.slice(0, 3).map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="text-[12.5px] text-[var(--color-ink-muted)]">
                    {stat.label}
                  </dt>
                  <dd className="text-[13px] font-semibold text-[var(--color-ink)]">
                    {stat.value}
                    {stat.unit ? ` ${stat.unit}` : ""}
                  </dd>
                </div>
              ))}
            </dl>

            <span className="mt-3.5 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-ink)] transition-transform duration-300 group-hover:translate-x-0.5">
              View {machine.name}
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Time left on this machine. Keyed on the pause flag so the bar and the
          timer that drives it always restart together. */}
      {!reduce ? (
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 z-[3] h-[3px] bg-[var(--color-hairline)] transition-opacity duration-300 ${
            paused ? "opacity-0" : "opacity-100"
          }`}
        >
          <motion.div
            key={`${machine.slug}-${paused}`}
            className="h-full origin-left"
            style={{ background: accent }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: MACHINE_MS / 1000, ease: "linear" }}
          />
        </div>
      ) : null}
    </div>
  );
}

/* The two machines waiting their turn: image and name, nothing else. Clicking
   one promotes it into the spotlight. */
function MiniMachineCard({
  entry,
  onSelect,
}: {
  entry: Entry;
  onSelect: () => void;
}) {
  const { machine, accent, tint } = entry;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Show ${machine.name}`}
      className={`${CARD_SHELL} ${CARD_LIFT} block text-left`}
      style={{ background: tint }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={machine.heroImage.src}
        alt=""
        loading="eager"
        draggable={false}
        className="pointer-events-none absolute right-3 bottom-2 h-[78%] w-[46%] object-contain object-right-bottom drop-shadow-[0_12px_28px_rgba(12,22,38,0.22)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />

      <div className="relative flex h-full flex-col justify-end p-5">
        <h2 className="flex items-center gap-2 font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent }}
          />
          {machine.name}
        </h2>
      </div>
    </button>
  );
}

/* Prints from the machines, sliding on their own timer. */
function PrintCarousel() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % PRINTS.length),
      PRINT_MS,
    );
    return () => clearTimeout(timer);
  }, [index, paused]);

  const print = PRINTS[index];

  return (
    <div
      className={`${CARD_SHELL} border-transparent bg-[var(--color-ink)]`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* No `mode`: outgoing and incoming frames overlap, which is what makes
          this a slide rather than a blink. */}
      <AnimatePresence initial={false}>
        <motion.img
          key={print.src}
          src={print.src}
          alt={print.alt}
          loading="eager"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: print.position }}
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, x: "8%", scale: 1.05 }
          }
          animate={{ opacity: 1, x: "0%", scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: "-6%", scale: 1.03 }}
          transition={{ duration: reduce ? 0.4 : 0.9, ease: EASE }}
        />
      </AnimatePresence>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(6,12,22,0.86))",
        }}
      />

      <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={print.caption}
            className="text-[13px] font-medium text-white/90"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {print.caption}
          </motion.p>
        </AnimatePresence>

        <div className="flex shrink-0 items-center gap-1.5 pb-1">
          {PRINTS.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.caption}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompanyHeroGrid() {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(
      () => setActiveIndex((i) => (i + 1) % LINEUP.length),
      MACHINE_MS,
    );
    return () => clearTimeout(timer);
  }, [activeIndex, paused]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  const active = LINEUP[activeIndex];
  /* Filtered rather than rotated: keeping the lineup's own order means a
     machine that stays on the bench keeps its slot instead of hopping. */
  const waiting = LINEUP.filter((_, i) => i !== activeIndex);

  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section
      aria-labelledby="company-hero-heading"
      className="relative overflow-hidden pt-28 pb-16 lg:pb-14"
    >
      {/* Background field: faint grid + drifting blue accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hairline-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline-subtle) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 70% 30%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 70% 30%, black, transparent 75%)",
          }}
        />
        <div
          className="absolute -top-24 right-[6%] h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--color-brand-surface), transparent)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-6%] h-[360px] w-[360px] rounded-full opacity-50 blur-3xl"
          style={{
            background: "radial-gradient(closest-side, #dcebfb, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6">
        {/* Fixed geometry: the headline, the copy, the spotlight and the print
            frame each own a slot, and only their contents change. */}
        <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 lg:h-[min(600px,calc(100dvh_-_12rem))] lg:auto-rows-auto lg:grid-cols-12 lg:grid-rows-[1.25fr_1fr_0.88fr] lg:gap-4">
          <motion.div
            {...reveal(0.1)}
            className="sm:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-3 lg:row-start-1"
          >
            <IntroCard />
          </motion.div>

          <motion.div
            {...reveal(0.24)}
            className="min-h-[420px] sm:col-span-2 lg:col-span-4 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:min-h-0"
          >
            <SpotlightCard
              entry={active}
              paused={paused}
              onPause={pause}
              onResume={resume}
            />
          </motion.div>

          <motion.div
            {...reveal(0.31)}
            className="min-h-[320px] sm:col-span-2 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1 lg:min-h-0"
          >
            <PrintCarousel />
          </motion.div>

          {waiting.map((entry, slot) => (
            <motion.div
              key={`bench-${slot}`}
              {...reveal(0.38 + slot * 0.06)}
              className={
                slot === 0
                  ? "lg:col-span-4 lg:col-start-6 lg:row-start-3"
                  : "lg:col-span-3 lg:col-start-10 lg:row-start-3"
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={entry.machine.slug}
                  className="h-full w-full"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <MiniMachineCard
                    entry={entry}
                    onSelect={() =>
                      setActiveIndex(LINEUP.indexOf(entry))
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
