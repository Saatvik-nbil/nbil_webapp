"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Timeline3D, { type TimelineEvent } from "@/components/ui/3d-interactive-timeline";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";
import { OriginButton } from "@/components/ui/origin-button";
import {
  STORY_CATEGORIES,
  STORY_MILESTONES,
  type StoryCategory,
} from "@/lib/story";

const EASE = [0.16, 1, 0.3, 1] as const;

type Filter = "All" | StoryCategory;

const FILTERS: Filter[] = ["All", ...STORY_CATEGORIES];

export default function OurStoryLanding() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");

  const events: TimelineEvent[] = useMemo(
    () =>
      STORY_MILESTONES.filter((m) => filter === "All" || m.category === filter).map(
        (m) => ({
          id: m.id,
          date: m.year,
          title: m.title,
          description: m.body,
          image: m.image,
          imageFit: m.fit,
          category: m.category,
        })
      ),
    [filter]
  );

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="our-story-heading"
        className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-[var(--color-dark-bg)] pt-32 pb-28 lg:pt-40 lg:pb-32"
      >
        <PhotoHeroBackdrop
          src="/images/heroes/our-story-hero.webp"
          objectPosition="50% 58%"
          fadeTo="248,250,252"
          fadeHeight="30%"
        />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <motion.p
            {...rise(0)}
            className="mb-3 font-mono text-[14px] uppercase tracking-[0.18em] text-[#8fbdfb]"
          >
            Our story
          </motion.p>
          <motion.h1
            {...rise(0.06)}
            id="our-story-heading"
            className="max-w-[18ch] font-display text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.025em] text-white lg:text-[3.4rem]"
          >
            Ten years from a bold idea to a working bioprinter range
          </motion.h1>
          <motion.p
            {...rise(0.12)}
            className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-white/75 lg:text-[17px]"
          >
            We began in 2016 with a single question: what
            would it take to print living tissue reliably enough for a lab to
            depend on it? What follows is the whole record — the patents, the
            grants, the partners who backed us early, and the recognitions that
            came along the way.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section
        aria-labelledby="timeline-heading"
        className="bg-[var(--color-canvas)] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2
            id="timeline-heading"
            className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] lg:text-[2rem]"
          >
            The full timeline
          </h2>

          {/* Category filter */}
          <div
            role="group"
            aria-label="Filter timeline by category"
            className="mt-6 flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const selected = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(f)}
                  className={[
                    "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60",
                    selected
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                      : "border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand-strong)]",
                  ].join(" ")}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <Timeline3D
          events={events}
          ariaLabel="Company milestones, 2016 to today"
          className="mt-12 lg:mt-16"
        />
      </section>

      {/* Closing CTA */}
      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-16 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-[20ch] font-display text-[1.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] lg:text-[2.25rem]">
              The next chapter is being written in someone&rsquo;s lab
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              Whether you are setting up a bioprinting facility or exploring a
              research collaboration, we would like to hear what you are working
              on.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <OriginButton href="/#connect" className="h-11 px-5 text-[14px]">
              Talk to us
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </OriginButton>
            <OriginButton href="/team" variant="outline" className="h-11 px-5 text-[14px]">
              Meet the team
            </OriginButton>
          </div>
        </div>
      </section>
    </>
  );
}
