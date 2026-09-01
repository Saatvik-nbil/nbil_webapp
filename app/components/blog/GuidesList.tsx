"use client";

import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";

type Guide = {
  title: string;
  excerpt: string;
  image: string;
  href: string;
  date: string;
  tags: string[];
  /** Guides hosted on this site render as internal links. */
  internal?: boolean;
  readTime?: string;
};

// New guides can be prepended here as they're published.
const GUIDES: Guide[] = [
  {
    title: "Getting Started with Dhee: A Quick-Start Guide",
    excerpt:
      "Import your model, configure the basic settings, review the toolpath and export a sliced file — nine steps to your first print.",
    image: "/images/blog/dhee-quick-start-cover.svg",
    href: "/blogs/dhee-quick-start",
    date: "Jul 31, 2026",
    tags: ["Guide", "Software"],
    internal: true,
    readTime: "6 min",
  },
];

export default function GuidesList() {
  return (
    <section
      id="guides"
      aria-labelledby="guides-heading"
      className="scroll-mt-24 bg-[var(--color-canvas)] py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-10 lg:mb-14">
          <p className="eyebrow text-[var(--color-brand-strong)]">
            Guides
          </p>
          <h2
            id="guides-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Step-by-step guides
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <GlassBlogCard
              key={guide.href}
              title={guide.title}
              excerpt={guide.excerpt}
              image={guide.image}
              href={guide.href}
              external={!guide.internal}
              date={guide.date}
              readTime={guide.readTime}
              tags={guide.tags}
              author={{ name: "Next Big Innovation Labs®" }}
              ctaLabel="Read guide"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
