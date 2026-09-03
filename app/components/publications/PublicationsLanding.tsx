"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, X, FilePdf, Quotes, Sliders } from "@phosphor-icons/react";
import { publications, type Publication } from "@/lib/publications";

/**
 * Papers published off the back of work done on a Trivima.
 *
 * Each card is the paper's own first page, rendered from the PDF, so the grid
 * reads as a shelf of reprints rather than a list of links. Opening one shows
 * how the machine was used and the abstract exactly as published; the two
 * links out go to the DOI and to the PDF we hold.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

function authorLine(authors: string[]) {
  if (authors.length <= 3) return authors.join(", ");
  return `${authors[0]} and ${authors.length - 1} others`;
}

function PublicationDialog({ pub, onClose }: { pub: Publication; onClose: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Lenis drives the page scroll, so pausing it (rather than only setting
    // overflow hidden) is what actually stops the page moving behind the
    // dialog. It is absent under prefers-reduced-motion, hence the guard.
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-[rgba(2,12,27,0.55)] p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publication-dialog-title"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-[0_30px_80px_rgba(2,12,27,0.35)] sm:max-h-[86dvh] sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 sm:p-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              <span className="text-[var(--color-brand-strong)]">{pub.journal}</span>
              <span aria-hidden="true">·</span>
              <span>{pub.year}</span>
              {pub.citation ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="normal-case tracking-normal">{pub.citation}</span>
                </>
              ) : null}
            </div>
            <h2
              id="publication-dialog-title"
              className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--color-ink)] sm:text-[1.5rem]"
            >
              {pub.title}
            </h2>
            <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
              {pub.authors.join(", ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            autoFocus
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline)] text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-ink)]"
          >
            <X size={15} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="flex flex-col gap-6">
            {/* How the machine was used */}
            <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Sliders size={15} weight="bold" className="text-[var(--color-brand-strong)]" aria-hidden="true" />
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-strong)]">
                  On a {pub.machine}
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{pub.trivimaUse}</p>
            </div>

            {/* Abstract, verbatim */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Quotes size={15} weight="fill" className="text-[var(--color-brand)]" aria-hidden="true" />
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  Abstract, as published
                </h3>
              </div>
              <p className="whitespace-pre-line text-[14.5px] leading-[1.75] text-[var(--color-ink)]">
                {pub.abstract}
              </p>
            </div>

            {pub.institutions.length > 0 || pub.topics.length > 0 ? (
              <div className="flex flex-col gap-3 border-t border-[var(--color-hairline)] pt-5">
                {pub.institutions.length > 0 ? (
                  <p className="text-[13px] text-[var(--color-ink-muted)]">
                    <span className="text-[var(--color-ink-faint)]">Lab</span>{" "}
                    {pub.institutions.join(" · ")}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-1.5">
                  {pub.topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--color-hairline)] px-2.5 py-1 text-[11.5px] text-[var(--color-ink-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 sm:p-6">
          <a
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            Read the full paper
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </a>
          <a
            href={pub.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)]"
          >
            <FilePdf size={15} weight="duotone" aria-hidden="true" />
            Open the PDF
          </a>
          <span className="ml-auto hidden text-[11.5px] text-[var(--color-ink-faint)] sm:block">
            DOI {pub.doi}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PublicationsLanding() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Publication | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const years = Array.from(new Set(publications.map((p) => p.year)));

  return (
    <main id="main-content" className="bg-[var(--color-canvas)]">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="flex max-w-3xl flex-col gap-5">
          <span className="eyebrow text-[var(--color-brand-strong)]">Publications</span>
          <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--color-ink)]">
            Research published on a Trivima
          </h1>
          <p className="text-[16px] leading-relaxed text-[var(--color-ink-muted)] lg:text-[17px]">
            Peer-reviewed work from labs running our bioprinters: cardiac patches,
            bone scaffolds, breast cancer models, hemostatic hydrogels. Open a paper
            to see how the machine was used and read the abstract as published.
          </p>
          <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-[var(--color-hairline)] pt-6">
            <div className="flex flex-col gap-1">
              <dd className="font-display text-[1.5rem] font-semibold text-[var(--color-ink)]">
                {publications.length}
              </dd>
              <dt className="text-[12px] text-[var(--color-ink-faint)]">Papers</dt>
            </div>
            <div className="flex flex-col gap-1">
              <dd className="font-display text-[1.5rem] font-semibold text-[var(--color-ink)]">
                {new Set(publications.map((p) => p.journal)).size}
              </dd>
              <dt className="text-[12px] text-[var(--color-ink-faint)]">Journals</dt>
            </div>
            <div className="flex flex-col gap-1">
              <dd className="font-display text-[1.5rem] font-semibold text-[var(--color-ink)]">
                {years[years.length - 1]}
                <span className="mx-1 text-[var(--color-ink-faint)]">to</span>
                {years[0]}
              </dd>
              <dt className="text-[12px] text-[var(--color-ink-faint)]">Published</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* Grid */}
      <section aria-label="Publications" className="mx-auto max-w-7xl px-6 pb-24 lg:pb-32">
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map((pub, i) => (
            <motion.li
              key={pub.slug}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 3) * 0.06, duration: 0.55, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => setOpen(pub)}
                aria-haspopup="dialog"
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] motion-reduce:hover:translate-y-0"
              >
                {/* First page of the paper, cropped to its top so the title
                    block is what shows in the card. */}
                <div className="relative h-[240px] overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-surface-raised)]">
                  <Image
                    src={pub.thumb}
                    alt={`First page of ${pub.title}`}
                    width={760}
                    height={983}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="absolute inset-x-0 top-0 w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white">
                    {pub.machine}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-x-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                    <span className="text-[var(--color-brand-strong)]">{pub.journal}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pub.year}</span>
                  </div>
                  <h2 className="font-display text-[15.5px] font-semibold leading-snug tracking-[-0.015em] text-[var(--color-ink)]">
                    {pub.title}
                  </h2>
                  <p className="text-[12.5px] text-[var(--color-ink-faint)]">
                    {authorLine(pub.authors)}
                  </p>
                  <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)] line-clamp-3">
                    {pub.trivimaUse}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px] font-medium text-[var(--color-brand-strong)]">
                    Read the abstract
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>

        <p className="mt-10 max-w-[70ch] text-[13.5px] leading-relaxed text-[var(--color-ink-faint)]">
          Published on a Trivima and not listed here? Send us the DOI and we will add
          it.
        </p>
      </section>

      <AnimatePresence>
        {open ? <PublicationDialog pub={open} onClose={close} /> : null}
      </AnimatePresence>
    </main>
  );
}
