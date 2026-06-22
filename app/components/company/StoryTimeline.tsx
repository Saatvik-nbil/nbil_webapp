"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  { year: "2016", title: "The starting line", body: "Founded in Bengaluru to build technology around transplant organs and bridge research and the clinic." },
  { year: "2019", title: "First patents", body: "Two foundational bioprinting patents granted, protecting the core extrusion approach." },
  { year: "2020", title: "Printing human tissue", body: "A process patent for bioprinting human tissue moves the platform toward clinical relevance." },
  { year: "2021", title: "Microsoft for Startups", body: "Selected into the Microsoft Startup Program, scaling the software and cloud workflow." },
  { year: "2022", title: "HiMedia partnership", body: "Strategic partnership with HiMedia Laboratories expands biomaterials and reach." },
  { year: "2023", title: "WEF Technology Pioneer", body: "Named a World Economic Forum Technology Pioneer; signed an R&D MoU with the Karnataka government." },
  { year: "Today", title: "A full range, a community", body: "A focused Trivima range shipping and 600+ researchers trained through Next Big Learning." },
];

export default function StoryTimeline() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const getScroll = () => el.scrollWidth - el.clientWidth;
        gsap.to(el, {
          x: () => -getScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + getScroll(),
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="story"
      aria-labelledby="story-heading"
      className="relative bg-[var(--color-surface)] border-y border-[var(--color-hairline)] overflow-hidden py-20 lg:py-0 lg:min-h-[100dvh] lg:flex lg:flex-col lg:justify-center"
    >
      <div className="max-w-7xl mx-auto px-6 w-full mb-10 lg:mb-12">
        <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)] mb-3">
          Our story
        </p>
        <h2
          id="story-heading"
          className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1] max-w-[20ch]"
        >
          Eight years from a bold idea to a working range
        </h2>
      </div>

      {/* Track: vertical on mobile, horizontal scrubbed on desktop */}
      <div
        ref={track}
        className="flex flex-col gap-6 px-6 lg:flex-row lg:gap-8 lg:px-[max(1.5rem,calc((100vw-80rem)/2))] lg:will-change-transform"
      >
        {MILESTONES.map((m, i) => (
          <article
            key={m.year}
            className="relative shrink-0 lg:w-[26rem] rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-7 lg:p-9 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[2rem] lg:text-[2.6rem] font-medium tracking-tight text-[var(--color-brand)] leading-none">
                {m.year}
              </span>
              <span className="text-[12px] font-mono text-[var(--color-ink-faint)]">
                {String(i + 1).padStart(2, "0")} / {String(MILESTONES.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              {m.title}
            </h3>
            <p className="text-[14.5px] text-[var(--color-ink-muted)] leading-relaxed">
              {m.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
