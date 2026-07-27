"use client";

import { motion, useReducedMotion } from "motion/react";
import { Quotes } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const TESTIMONIALS = [
  {
    quote:
      "The technical oversight provided by NBIL during our heart-on-a-chip project was instrumental. Their bioink mastery is unparalleled.",
    name: "Dr. Elena Rostova",
    role: "Lead Researcher, BioSystems Lab",
  },
  {
    quote:
      "Transitioning from academic research to industrial scaling was seamless thanks to NBIL's regulatory strategy consultancy.",
    name: "Dr. Aditya Menon",
    role: "Principal Scientist, Regenova",
  },
];

export default function ConsultancyTestimonials() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-[var(--color-surface)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          id="testimonials-heading"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-display text-[clamp(2.75rem,8vw,5rem)] font-bold tracking-[-0.035em] text-[var(--color-ink)] text-center mb-14 lg:mb-20"
        >
          Testimonials
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
              className="flex flex-col gap-6 rounded-2xl border border-[var(--color-hairline)] bg-gradient-to-b from-[var(--color-brand-subtle)] to-[var(--color-surface-raised)] p-8"
            >
              <Quotes size={28} weight="fill" className="text-[var(--color-brand)]/45" />
              <blockquote className="text-[15px] italic text-[var(--color-ink)] leading-[1.7]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3.5 pt-2">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-surface)] text-[13px] font-semibold text-[var(--color-brand-strong)]">
                  {t.name
                    .replace(/^(Dr\.|Prof\.)\s+/, "")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[var(--color-ink)]">
                    {t.name}
                  </span>
                  <span className="text-[12.5px] text-[var(--color-ink-muted)]">
                    {t.role}
                  </span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
