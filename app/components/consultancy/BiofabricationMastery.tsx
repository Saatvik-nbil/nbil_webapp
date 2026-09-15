"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { value: "10+", label: "Years" },
  { value: "30+", label: "Projects" },
  { value: "12+", label: "Partners" },
];

const CAPABILITIES = [
  "Proprietary Hydrogel Crosslinking Methods",
  "Multi-Material Extrusion Optimization",
  "Vascularization Strategic Roadmaps",
];

export default function BiofabricationMastery() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="mastery-heading"
      className="bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-6"
        >
          <h2
            id="mastery-heading"
            className="h2"
          >
            Biofabrication Mastery
          </h2>
          <p className="text-[16px] lg:text-[17px] text-[var(--color-ink-muted)] leading-[1.7] max-w-[52ch]">
            NBIL stands at the vanguard of bioconvergence. Our consultancy
            bridges the gap between theoretical biological research and scalable
            manufacturing solutions, providing the strategic framework required
            for high-stakes tissue engineering.
          </p>

          <dl className="mt-2 grid grid-cols-3 gap-6 max-w-md">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
                className="flex flex-col gap-1"
              >
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-[2.25rem] lg:text-[2.75rem] font-bold tracking-[-0.03em] text-[var(--color-brand-strong)] leading-[1]">
                  {value}
                </dd>
                <span
                  aria-hidden="true"
                  className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]"
                >
                  {label}
                </span>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
          className="flex flex-col divide-y divide-[var(--color-hairline)] rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-7 lg:px-9"
        >
          {CAPABILITIES.map((item) => (
            <li key={item} className="flex items-center gap-4 py-6">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-[var(--color-brand-strong)]"
              />
              <span className="text-[15.5px] font-medium text-[var(--color-ink)] leading-[1.4]">
                {item}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
