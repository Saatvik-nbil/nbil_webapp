"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, EnvelopeSimple } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const SUBSTACK_URL = "https://nextbiginnovationlabs.substack.com";
const SUBSCRIBE_URL = "https://nextbiginnovationlabs.substack.com/subscribe";

type Issue = {
  title: string;
  excerpt: string;
  image: string;
  href: string;
  date: string;
};

// Seeded from nextbiginnovationlabs.substack.com — links point to the specific posts.
const ISSUES: Issue[] = [
  {
    title: "3D Bioprinting Offers a Breakthrough for Corneal Diseases",
    excerpt:
      "Bioprinted corneal stroma patches that replicate native structure could address global donor shortages with scalable, biocompatible implants.",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/4e95933e-1cf1-4190-bceb-c17c72eb7e6e_1200x628.png",
    href: "https://nextbiginnovationlabs.substack.com/p/3d-bioprinting-offers-a-breakthrough",
    date: "Mar 16, 2026",
  },
  {
    title: "3D Bioprinting Brings Hope for Kidney Regeneration",
    excerpt:
      "A kidney-derived decellularized ECM bioink for functional renal constructs shows potential for tackling chronic kidney disease.",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/a4eaf1fb-8e4d-4d97-a6bb-85df1e7f15fa_1200x628.png",
    href: "https://nextbiginnovationlabs.substack.com/p/3d-bioprinting-kidney-ecm-bioink-regeneration",
    date: "Aug 29, 2025",
  },
  {
    title: "A New Era in Brain Tumor Research",
    excerpt:
      "Bioprinted brain tumor models using multiple cell types and ECM components enable richer microenvironments for drug screening.",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/90978030-d7b1-4f26-962b-644dae4b3ae0_1200x628.png",
    href: "https://nextbiginnovationlabs.substack.com/p/a-new-era-in-brain-tumor-research",
    date: "Feb 6, 2025",
  },
  {
    title: "Advancing Tissue Engineering: High-Throughput Bioprinting of Spheroids",
    excerpt:
      "The HITS-Bio platform positions spheroids ten times faster than existing techniques while keeping over 90% cell viability.",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/de3cd9cd-d728-4fe0-aa71-8ec850e0e879_1200x628.png",
    href: "https://nextbiginnovationlabs.substack.com/p/advancing-tissue-engineering-high",
    date: "Dec 31, 2024",
  },
  {
    title: "Triaxial Bioprinting: Revolutionizing Organ Biofabrication",
    excerpt:
      "An extrusion method that deposits three bioinks at once, enabling multilayered tissues and complex vascularized constructs.",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/7a41c97b-e404-4f96-bd2c-5a741799b95f_1200x628.png",
    href: "https://nextbiginnovationlabs.substack.com/p/triaxial-bioprinting-revolutionizing",
    date: "Dec 13, 2024",
  },
  {
    title: "Precision Medicine: The Role of Inkjet Printing in Pharmaceuticals",
    excerpt:
      "Inkjet printing enables personalized drug delivery through orodispersible films and customizable tablets with precise dosing.",
    image:
      "https://substack-post-media.s3.amazonaws.com/public/images/775451ba-ca36-4b3f-98fe-d5585719a291_1200x628.png",
    href: "https://nextbiginnovationlabs.substack.com/p/precision-medicine-the-role-of-inkjet",
    date: "Oct 9, 2024",
  },
];

export default function NewsletterSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="scroll-mt-24 bg-[var(--color-surface)] pt-32 pb-16 lg:pt-40 lg:pb-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header + subscribe */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-14">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              Newsletter
            </p>
            <h2
              id="newsletter-heading"
              className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              The NBIL bioprinting newsletter
            </h2>
            <p className="text-[15.5px] text-[var(--color-ink-muted)] leading-relaxed">
              Research breakdowns and biofabrication news, published on Substack.
              Subscribe for new issues, or read any of the recent ones below.
            </p>
          </div>
          <a
            href={SUBSCRIBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            <EnvelopeSimple size={18} weight="bold" />
            Subscribe to newsletter
          </a>
        </div>

        {/* Issues grid — preview + Learn more (no full embed) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ISSUES.map((issue, i) => (
            <motion.article
              key={issue.href}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 3) * 0.06, duration: 0.5, ease: EASE }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_10px_30px_rgba(2,12,27,0.05)] transition-all duration-300 hover:border-[var(--color-brand)]/60 hover:shadow-[0_18px_50px_rgba(45,129,228,0.12)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[var(--color-surface)]/85 px-2.5 py-1 text-[11px] font-medium text-[var(--color-ink)] backdrop-blur-sm">
                  Substack
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-[12px] text-[var(--color-ink-faint)]">
                  {issue.date}
                </span>
                <h3 className="font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-ink)] line-clamp-2">
                  {issue.title}
                </h3>
                <p className="text-[13.5px] text-[var(--color-ink-muted)] leading-relaxed line-clamp-3">
                  {issue.excerpt}
                </p>
                <a
                  href={issue.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-[14px] font-semibold text-[var(--color-brand-strong)] transition-colors hover:text-[var(--color-brand)]"
                >
                  Learn more
                  <ArrowUpRight size={15} weight="bold" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-brand-strong)]"
          >
            View all issues on Substack
            <ArrowUpRight size={15} weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}
