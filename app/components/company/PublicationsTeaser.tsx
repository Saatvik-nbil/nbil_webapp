"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { publications } from "@/lib/publications";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Landing-page proof band: the first-page renders of the four most recent
 * papers whose work ran on a Trivima, linking through to /publications where
 * every record, abstract and DOI lives.
 */
const FEATURED = publications.slice(0, 4);

/** "Bera et al." from the full author list, or the single name if there is one. */
function firstAuthor(authors: string[]) {
  const [first] = authors;
  if (!first) return "";
  const surname = first.trim().split(/\s+/).slice(-1)[0];
  return authors.length > 1 ? `${surname} et al.` : surname;
}

export default function PublicationsTeaser() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="publications-teaser-heading"
      className="py-20 lg:py-28 bg-[var(--color-surface-raised)] border-y border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* The button sits on the heading's line, not the bottom of the copy
            block: aligning it to the end of a three-line paragraph left it
            floating well below everything it belongs to. */}
        <div className="mb-12 lg:mb-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <h2
              id="publications-teaser-heading"
              className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1] max-w-[18ch]"
            >
              The work our machines end up in
            </h2>

            <OriginButton
              href="/publications"
              variant="outline"
              className="shrink-0 self-start px-5 text-[14px] font-semibold sm:mt-1.5"
            >
              See all publications
              <ArrowUpRight size={16} weight="bold" />
            </OriginButton>
          </div>

          <p className="mt-5 max-w-[62ch] text-[15px] text-[var(--color-ink-muted)] leading-[1.75]">
            Peer-reviewed papers where the printing was done on a Trivima, in
            journals that name the machine in their own methods section.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {FEATURED.map((pub, i) => (
            <motion.div
              key={pub.slug}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5, ease: EASE }}
            >
              {/* Straight out to the published article: a reader who clicks a
                  specific paper wants that paper, not the index page. */}
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-4 transition-shadow hover:shadow-[0_18px_50px_rgba(2,12,27,0.12)]"
              >
                <div className="overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pub.thumb}
                    alt={`First page of ${pub.title}`}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-[14.5px] font-semibold tracking-[-0.01em] text-[var(--color-ink)] leading-[1.35] line-clamp-3">
                    {pub.title}
                  </h3>
                  <span className="text-[12.5px] text-[var(--color-ink-muted)]">
                    {firstAuthor(pub.authors)}, {pub.year}
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
