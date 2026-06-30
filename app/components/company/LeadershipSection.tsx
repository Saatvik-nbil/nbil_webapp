"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const LEADERS = [
  { name: "Piyush Padmanabhan", role: "CEO, Co-Founder & Director", image: "/founders/Piyush.png" },
  { name: "Pooja Venkatesh", role: "Co-CEO & Co-Founder", image: "/founders/Pooja.jpg" },
  { name: "Alok Medikepura Anil", role: "Co-Founder & Director", image: "/founders/Alok.jpg" },
];

export default function LeadershipSection() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="leaders-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
            Leadership
          </p>
          <h2
            id="leaders-heading"
            className="font-display text-[2rem] lg:text-[2.6rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Engineers and scientists, in equal measure
          </h2>
          <p className="text-[1rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[44ch]">
            NBIL was founded by a team that pairs hard engineering with biomedical
            science, the two disciplines bioprinting demands.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {LEADERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 90vw, 28vw"
                  className="object-cover object-top grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                  {p.name}
                </h3>
                <p className="text-[13px] text-[var(--color-ink-muted)]">{p.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
