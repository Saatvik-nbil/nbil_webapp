"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type CaseStudy = {
  watermark: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** image column on large screens: left or right */
  imageSide: "left" | "right";
};

const CASES: CaseStudy[] = [
  {
    watermark: "Merck",
    title: "Trivima Bioprinter for Merck KGaA (Darmstadt, Germany)",
    body: "As a part of the Merck Accelerator Program, our team developed a customised bioprinting solution for the scientists studying drug efficacy and cellular interaction. To achieve this goal, we developed a medium throughput bioprinter that could print within 96 and 384 well plates within a span of 4 minutes. We achieved high print fidelity as well as a high level of precision by printing one biomaterial right on top of another and bioprinting two biomaterials side-by-side in a 96 well plate setup.",
    image: "/images/applications-2.png",
    alt: "Bioprinted 96 well plate for drug efficacy studies",
    imageSide: "left",
  },
  {
    watermark: "MS Ramaiah University",
    title: "Bioceramic scaffolds for fracture healing",
    body: "Proprietary biomaterial comprising of bioceramic (β-TCP) for minor and major fracture healing applications, engineered alongside the research team for reproducible, clinically relevant scaffold architectures.",
    image: "/images/np-seq/np-050.jpg",
    alt: "Bioprinted bioceramic scaffold for fracture healing",
    imageSide: "right",
  },
];

export default function CaseStudies() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="case-studies-heading"
      className="bg-[var(--color-surface)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-14 lg:mb-20">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
            Selected work
          </p>
          <h2
            id="case-studies-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Custom bioprinting, delivered with partners
          </h2>
        </div>

        <div className="flex flex-col gap-20 lg:gap-28">
          {CASES.map((c, i) => (
            <div
              key={c.watermark}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Image */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE }}
                className={c.imageSide === "right" ? "lg:order-2" : "lg:order-1"}
              >
                <div className="relative overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] shadow-[0_18px_50px_rgba(2,12,27,0.12)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Copy + watermark */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
                className={`relative ${c.imageSide === "right" ? "lg:order-1" : "lg:order-2"}`}
              >
                {/* Oversized brand watermark */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none block font-display font-bold tracking-[-0.03em] leading-[0.85] text-[var(--color-ink)]/[0.06] text-[clamp(2.75rem,7vw,4.75rem)] mb-4"
                >
                  {c.watermark}
                </span>
                <h3 className="font-display text-[1.35rem] lg:text-[1.6rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-[1.2]">
                  {c.title}
                </h3>
                <p className="mt-4 text-[15px] text-[var(--color-ink-muted)] leading-[1.75]">
                  {c.body}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
