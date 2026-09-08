"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, X, Quotes, Sliders } from "@phosphor-icons/react";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";
import { OriginButton } from "@/components/ui/origin-button";
import { publications, type Publication } from "@/lib/publications";
import PublicationsCarousel from "./PublicationsCarousel";

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
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--color-ink-faint)]">
              <span className="font-medium text-[var(--color-brand-strong)]">{pub.journal}</span>
              <span aria-hidden="true">·</span>
              <span>{pub.year}</span>
              {pub.citation ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{pub.citation}</span>
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
        {/* Lenis calls preventDefault on wheel events globally, so without
            this the trackpad does nothing here and the abstract has to be
            dragged by its scrollbar. */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
          <div className="flex flex-col gap-6">
            {/* How the machine was used */}
            <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Sliders size={15} weight="bold" className="text-[var(--color-brand-strong)]" aria-hidden="true" />
                <h3 className="text-[13.5px] font-semibold text-[var(--color-brand-strong)]">
                  On a {pub.machine}
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{pub.trivimaUse}</p>
            </div>

            {/* Abstract, verbatim */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Quotes size={15} weight="fill" className="text-[var(--color-brand)]" aria-hidden="true" />
                <h3 className="text-[13.5px] font-semibold text-[var(--color-ink-faint)]">
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
                      className="rounded-lg border border-[var(--color-hairline)] px-2.5 py-1 text-[11.5px] text-[var(--color-ink-muted)]"
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
          <OriginButton
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 text-[14px] font-semibold"
          >
            Read the full paper
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </OriginButton>
          <span className="ml-auto text-[11.5px] text-[var(--color-ink-faint)]">
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

  // Min and max, not first and last: the array is ordered for the shelf, not
  // by year, so positional reads gave the wrong span as soon as a paper was
  // inserted anywhere but the end.
  const years = publications.map((p) => Number(p.year)).filter(Number.isFinite);
  const stats = [
    { value: String(publications.length), label: "Papers" },
    { value: String(new Set(publications.map((p) => p.journal)).size), label: "Journals" },
    { value: `${Math.min(...years)} to ${Math.max(...years)}`, label: "Published" },
  ];

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
            <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white">
              Research published on a Trivima
            </h1>
            <p className="text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
              Peer-reviewed work from labs running our bioprinters: cardiac patches,
              bone scaffolds, breast cancer models and hemostatic hydrogels, each
              printed on a machine configured for that lab.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The shelf */}
      <section aria-label="Publications" className="mx-auto max-w-7xl py-16 lg:py-24">
        {/* Three equal columns, so each figure sits under its own third of the
            rule above rather than bunching at the left of it. */}
        <dl className="mx-6 mb-12 grid grid-cols-3 gap-4 border-b border-[var(--color-hairline)] pb-8 lg:mb-16">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <dd className="font-display text-[1.6rem] font-semibold leading-none text-[var(--color-ink)] sm:text-[2rem]">
                {s.value}
              </dd>
              <dt className="text-[12.5px] text-[var(--color-ink-muted)]">{s.label}</dt>
            </div>
          ))}
        </dl>

        <PublicationsCarousel publications={publications} onOpen={setOpen} />
        <p className="mt-10 max-w-[70ch] px-6 text-[13.5px] leading-relaxed text-[var(--color-ink-faint)]">
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
