"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { FEATURED_MILESTONES, STORY_MILESTONES } from "@/lib/story";

gsap.registerPlugin(ScrollTrigger);

// The curated arc shown here is a subset of `lib/story.ts`; the full record —
// every award, grant, collaboration and incubation — lives on /our-story,
// reached through the "Explore more" card at the end of the track.
const MILESTONES = FEATURED_MILESTONES;

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
          Ten years from a bold idea to a working range
        </h2>
      </div>

      {/* Track: vertical on mobile, horizontal scrubbed on desktop */}
      <div
        ref={track}
        className="flex flex-col gap-6 px-6 lg:flex-row lg:gap-8 lg:px-[max(1.5rem,calc((100vw-80rem)/2))] lg:will-change-transform"
      >
        {MILESTONES.map((m, i) => (
          <article
            key={`${m.year}-${m.title}`}
            className="relative shrink-0 lg:w-[26rem] rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-7 lg:p-9 flex flex-col gap-4"
          >
            {/* Photo — replace `image` in MILESTONES to swap this placeholder.
                Tilted in 3D at rest, flattens and lifts on hover. */}
            <div className="group/photo [perspective:1000px]">
              <div
                className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] shadow-[0_18px_38px_-16px_rgba(2,12,27,0.45)] transition-transform duration-500 ease-out will-change-transform [transform:rotateX(9deg)_rotateY(-8deg)] group-hover/photo:[transform:rotateX(0deg)_rotateY(0deg)_translateY(-4px)_scale(1.02)] ${
                  m.image ? "" : "border-dashed"
                }`}
              >
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image}
                    alt={m.title}
                    loading="lazy"
                    className={
                      m.fit === "contain"
                        ? "h-full w-full object-contain p-5"
                        : "h-full w-full object-cover"
                    }
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[var(--color-ink-faint)]">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em]">Photo</span>
                    <span className="text-[11px]">coming soon</span>
                  </div>
                )}
              </div>
            </div>
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

        {/* Terminal CTA — the full record continues on /our-story. Sized like
            the article cards so the GSAP scrub width still resolves. */}
        <Link
          href="/our-story"
          className="group relative shrink-0 lg:w-[26rem] rounded-2xl border border-[var(--color-brand)] bg-[var(--color-brand)] p-7 lg:p-9 flex flex-col justify-between gap-8 text-white transition-transform duration-300 ease-out hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
        >
          <div>
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-white/70 mb-4">
              The full record
            </p>
            <h3 className="font-display text-[1.9rem] lg:text-[2.2rem] font-semibold tracking-[-0.025em] leading-[1.1]">
              Explore more
            </h3>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/80">
              Every award, grant, collaboration and milestone since 2016 — all{" "}
              {STORY_MILESTONES.length} of them, on one page.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-[14px] font-medium">
            See the whole story
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
