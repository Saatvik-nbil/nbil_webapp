"use client";

import React from "react";

// Real recognition & affiliations (scraped from nextbiginnovationlabs.com
// + the official About page). Press logos are the company's own assets pulled
// from the site; institutional partners are shown as wordmarks (no hosted logo).
type Item = { name: string; logo?: string };

const FEATURED: Item[] = [
  { name: "World Economic Forum", logo: "/images/recognition/wef.png" },
  { name: "CNBC", logo: "/images/recognition/cnbc.png" },
  { name: "The Hindu", logo: "/images/recognition/the-hindu.png" },
  { name: "LiveMint", logo: "/images/recognition/livemint.png" },
  { name: "Times Now", logo: "/images/recognition/times-now.png" },
  { name: "YourStory", logo: "/images/recognition/yourstory.png" },
  { name: "Hans India", logo: "/images/recognition/hans-india.png" },
];

const PARTNERS: Item[] = [
  { name: "Microsoft for Startups", logo: "/institute/msft.png" },
  { name: "IISc Bengaluru", logo: "/institute/IISc_Master_Seal_Transparent.png" },
  { name: "AIIMS New Delhi", logo: "/institute/All_India_Institute_of_Medical_Sciences,_Delhi.svg.webp" },
  { name: "IIT Hyderabad", logo: "/institute/iithyd.png" },
  { name: "CSIR-CLRI", logo: "/institute/csir-clri-logo.png" },
  { name: "HiMedia Laboratories", logo: "/institute/HiMedia_Logo_-1.png" },
  { name: "Manipal University", logo: "/institute/Manipal_University_logo.png" },
  { name: "Govt. of Karnataka", logo: "/institute/the-karnataka-government-kannada-logo-png_seeklogo-407164.png" },
  { name: "AIC-JITF", logo: "/institute/aic-jitf-logo.png" },
];

function Chip({ item }: { item: Item }) {
  return (
    <div className="flex shrink-0 items-center gap-4 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] pl-3.5 pr-8 py-3 shadow-[0_1px_2px_rgba(2,12,27,0.04)]">
      {item.logo ? (
        <span className="grid size-25 place-items-center rounded-full bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.logo} alt={item.name} className="h-20 w-20 object-contain" loading="lazy" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-20 place-items-center rounded-full bg-[var(--color-brand-surface)] text-[24px] font-semibold text-[var(--color-brand-strong)]"
        >
          {item.name.replace(/^(Govt\. of|The)\s+/i, "").trim().charAt(0)}
        </span>
      )}
      <span className="whitespace-nowrap text-[18px] font-medium text-[var(--color-ink-muted)]">
        {item.name}
      </span>
    </div>
  );
}

function MarqueeRow({ items, direction }: { items: Item[]; direction: "left" | "right" }) {
  const loop = [...items, ...items];
  return (
    <div className="flex w-max">
      <div className={`flex shrink-0 gap-4 pr-4 ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}>
        {loop.map((item, i) => (
          <Chip key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function IntegrationHero() {
  return (
    <section
      aria-labelledby="recognition-heading"
      className="relative overflow-hidden border-y border-[var(--color-hairline)] bg-[var(--color-canvas)] py-20 lg:py-24"
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
        <div className="relative flex flex-col gap-4 overflow-hidden">
          <MarqueeRow items={FEATURED} direction="left" />
          <MarqueeRow items={PARTNERS} direction="right" />

          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 lg:w-36 bg-gradient-to-r from-[var(--color-canvas)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 lg:w-36 bg-gradient-to-l from-[var(--color-canvas)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
