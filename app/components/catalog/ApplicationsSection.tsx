"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const APPLICATIONS = [
  {
    title: "Vascular & tubular constructs",
    body: "Perfusable grafts, small-diameter vessels, stents and ducts via coaxial and rotary printing.",
    models: "NP · Advanced · Pro",
  },
  {
    title: "Organoids & spheroids",
    body: "Reproducible organoid arrays and spheroids with consistent geometry for disease models.",
    models: "Advanced · Pro · NP",
  },
  {
    title: "Respiratory & airway models",
    body: "Tracheal and bronchial scaffolds with uniform internal lumens.",
    models: "NP",
  },
  {
    title: "Organ-on-chip systems",
    body: "Microfluidic devices and compartmentalized tissue chambers at high resolution.",
    models: "Aura",
  },
  {
    title: "Soft & hard tissue scaffolds",
    body: "Hydrogel, bioceramic and synthetic-polymer scaffolds across the extrusion range.",
    models: "Mini · Basic · Advanced",
  },
  {
    title: "Ocular & corneal constructs",
    body: "Hydrogel contact-lens prototypes and corneal models with mold-assisted workflows.",
    models: "NP",
  },
];

export default function ApplicationsSection() {
  const reduce = useReducedMotion();

  return (
    <section id="applications" aria-labelledby="applications-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Sticky intro */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 flex flex-col gap-4">
            <h2
              id="applications-heading"
              className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              What researchers build
            </h2>
            <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
              Across the range, Trivima systems fabricate the constructs behind tissue
              engineering, regenerative medicine and microphysiological research.
            </p>
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              Not sure which system fits?{" "}
              <Link href="#contact" className="font-medium text-[var(--color-brand)] hover:underline underline-offset-4">
                Talk to the NBIL team
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Application rows */}
        <dl className="lg:col-span-8 border-t border-[var(--color-hairline)]">
          {APPLICATIONS.map((app, i) => (
            <motion.div
              key={app.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: (i % 2) * 0.05, duration: 0.5, ease: EASE }}
              className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 border-b border-[var(--color-hairline)] py-6"
            >
              <div className="flex flex-col gap-1.5">
                <dt className="font-display text-[1.125rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                  {app.title}
                </dt>
                <dd className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[52ch]">
                  {app.body}
                </dd>
              </div>
              <span className="font-mono text-[12px] text-[var(--color-brand)] sm:text-right sm:pt-1 whitespace-nowrap">
                {app.models}
              </span>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
