"use client";

import { motion, useReducedMotion } from "motion/react";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";
import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";
import { firstAuthor, publications } from "@/lib/publications";

/**
 * Papers published off the back of work done on a Trivima.
 *
 * Each card is the paper's own first page, rendered from the PDF, so the grid
 * reads as a shelf of reprints rather than a list of links. Opening one shows
 * how the machine was used and the abstract exactly as published, with the
 * single link out going to the publisher via the DOI. We deliberately do not
 * offer the PDF: readers should land on the published article.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PublicationsLanding() {
  const reduce = useReducedMotion();
  return (
    <main id="main-content" className="bg-[var(--color-canvas)]">
      {/* Hero */}
      <section data-nav-theme="dark" className="relative isolate flex min-h-svh items-center overflow-hidden bg-[var(--color-photo-ground)] pt-32 pb-24 lg:pt-40 lg:pb-28">
        <PhotoHeroBackdrop
          src="/images/publications-hero.webp"
          objectPosition="58% 30%"
        />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex max-w-2xl flex-col gap-5"
          >
            <h1 className="h1 text-white">
              Trivima in the Literature.
            </h1>
            <p className="text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
              Independent studies from labs running our Trivima, published in
              Biofabrication, Advanced Healthcare Materials, and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Set like the blog index: one card per paper, each one a link
          straight out to the published article. */}
      <section aria-label="Publications" className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map((pub) => (
            <GlassBlogCard
              key={pub.slug}
              title={pub.title}
              excerpt={pub.abstract}
              image={pub.thumb}
              imageClassName="object-top"
              href={pub.url}
              external
              date={`${pub.journal} \u00b7 ${pub.year}`}
              tags={[firstAuthor(pub.authors), pub.institutions[0]].filter(Boolean)}
              ctaLabel="Read the paper"
            />
          ))}
        </div>
        <p className="mt-10 max-w-[70ch] text-[13.5px] leading-relaxed text-[var(--color-ink-faint)]">
          Published on a Trivima and not listed here? Send us the DOI and we will add
          it.
        </p>
      </section>
    </main>
  );
}
