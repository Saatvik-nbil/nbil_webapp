"use client";

import React from "react";

// Real recognition & affiliations (scraped from nextbiginnovationlabs.com
// + the official About page). No invented partnerships, no placeholder logos.
const FEATURED = [
  "World Economic Forum",
  "CNBC",
  "The Hindu",
  "LiveMint",
  "Times Now",
  "YourStory",
  "Hans India",
];

const PARTNERS = [
  "Microsoft for Startups",
  "HiMedia Laboratories",
  "IIT Hyderabad",
  "AIIMS New Delhi",
  "Govt. of Karnataka",
  "Jyothy Institute of Technology",
];

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  // Duplicate the set so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div className="flex w-max">
      <div className={`flex shrink-0 items-center gap-12 pr-12 ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}>
        {loop.map((name, i) => (
          <div key={`${name}-${i}`} className="flex items-center gap-12" aria-hidden={i >= items.length}>
            <span className="whitespace-nowrap font-display text-[1.15rem] lg:text-[1.4rem] font-semibold tracking-tight text-[var(--color-ink-faint)]">
              {name}
            </span>
            <span className="size-1.5 rounded-full bg-[var(--color-hairline)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IntegrationHero() {
  return (
    <section
      aria-labelledby="recognition-heading"
      className="relative overflow-hidden border-y border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 lg:py-24"
    >
      {/* subtle dotted grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle at center, var(--color-hairline-subtle) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(black, transparent 92%)",
          WebkitMaskImage: "linear-gradient(black, transparent 92%)",
        }}
      />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 lg:mb-14 flex flex-col gap-4 max-w-2xl">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
            In good company
          </p>
          <h2
            id="recognition-heading"
            className="font-display text-[2rem] lg:text-[2.6rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Recognised where it counts
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            A World Economic Forum Technology Pioneer, featured across national media, and
            built alongside leading research institutions and accelerators.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative flex flex-col gap-6 overflow-hidden">
          <MarqueeRow items={FEATURED} direction="left" />
          <MarqueeRow items={PARTNERS} direction="right" />

          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 lg:w-40 bg-gradient-to-r from-[var(--color-surface)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 lg:w-40 bg-gradient-to-l from-[var(--color-surface)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
