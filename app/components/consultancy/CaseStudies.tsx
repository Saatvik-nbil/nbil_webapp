"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type CaseStudy = {
  watermark: string;
  title: string;
  body: string;
  /** Omit where we have no photograph cleared for use; the visual column
   *  falls back to a typographic plate carrying the partner's name. */
  image?: string;
  alt?: string;
};

/** Shown on arrival. */
const FEATURED: CaseStudy[] = [
  {
    watermark: "Merck",
    title: "Trivima Bioprinter for Merck KGaA (Darmstadt, Germany)",
    body: "As a part of the Merck Accelerator Program, our team developed a customised bioprinting solution for the scientists studying drug efficacy and cellular interaction. To achieve this goal, we developed a medium throughput bioprinter that could print within 96 and 384 well plates within a span of 4 minutes. We achieved high print fidelity as well as a high level of precision by printing one biomaterial right on top of another and bioprinting two biomaterials side-by-side in a 96 well plate setup.",
    image: "/images/cases/merck-kgaa.webp",
    alt: "Merck signage outside the company's Darmstadt campus",
  },
  {
    watermark: "MS Ramaiah University",
    title: "Bioceramic scaffolds for fracture healing",
    body: "Proprietary biomaterial comprising of bioceramic (β-TCP) for minor and major fracture healing applications, engineered alongside the research team for reproducible, clinically relevant scaffold architectures.",
    image: "/images/cases/ms-ramaiah.webp",
    alt: "The MS Ramaiah Institute of Technology campus in Bengaluru",
  },
];

/** Revealed behind the control. */
const MORE: CaseStudy[] = [
  {
    watermark: "KLE College of Pharmacy",
    title: "Drug-loaded silk scaffolds for pharmaceutics research",
    body: "KLE College of Pharmacy needed drug-release behaviour tested on a silk fibroin scaffold, a common carrier for controlled drug delivery studies. We carried it from brief to finished batch in one project cycle: our design engineer built the geometry, our biofabrication engineer optimised the print protocol on Trivima, and thirty scaffolds were produced against the finalised parameters. Four additional biomaterial blends used across the same study were optimised in parallel, so the group left with a validated print window for every material in the work, not just one. They received a complete, thorough report covering both the successes and the failures encountered during optimisation.",
    image: "/images/cases/kle-pharmacy.webp",
    alt: "The KLE College of Pharmacy campus building in Belagavi",
  },
  {
    watermark: "Univlabs",
    title: "Print protocol development for a proprietary biomaterial",
    body: "Univlabs, a medical technology company, brought us a proprietary biomaterial with no existing print profile. We established its full parameter window, pressure, temperature, and speed, within a single optimisation cycle, then handed the process off for on-demand scaffold production. No repeated trial batches, no extended back-and-forth: one optimisation phase, one working protocol, production-ready from there.",
    image: "/images/cases/univlabs.webp",
    alt: "The UnivLabs headquarters building, its name across the facade",
  },
];

/** Image column sits left on even rows, right on odd ones, counted across
 *  both lists so the zigzag survives the reveal. */
function CaseRow({ c, index }: { c: CaseStudy; index: number }) {
  const reduce = useReducedMotion();
  const imageRight = index % 2 === 1;

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* Image */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={imageRight ? "lg:order-2" : "lg:order-1"}
      >
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] shadow-[0_18px_50px_rgba(2,12,27,0.12)]">
          {c.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.image}
              alt={c.alt ?? ""}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,var(--color-brand-subtle),var(--color-surface-raised)_70%)] p-8">
              <span
                aria-hidden="true"
                className="select-none text-center font-display text-[clamp(1.5rem,3.4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)]/15"
              >
                {c.watermark}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Copy + watermark */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
        className={`relative ${imageRight ? "lg:order-1" : "lg:order-2"}`}
      >
        {/* Oversized brand watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none block font-display font-bold tracking-[-0.03em] leading-[0.85] text-[var(--color-ink)]/25 text-[clamp(2.75rem,7vw,4.75rem)] mb-4"
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
  );
}

export default function CaseStudies() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="case-studies-heading"
      className="bg-[var(--color-surface)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-14 lg:mb-20">
          <h2
            id="case-studies-heading"
            className="h2"
          >
            Custom bioprinting, delivered with partners
          </h2>
        </div>

        <div className="flex flex-col gap-20 lg:gap-28">
          {FEATURED.map((c, i) => (
            <CaseRow key={c.watermark} c={c} index={i} />
          ))}
        </div>

        {/* The rest, behind the control. Height animates from the measured
         *  content height so the reveal reads as one continuous open. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="case-studies-more"
              key="more"
              initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.7, ease: EASE },
                opacity: { duration: 0.45, ease: "easeOut", delay: 0.05 },
              }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-20 pt-20 lg:gap-28 lg:pt-28">
                {MORE.map((c, i) => (
                  <motion.div
                    key={c.watermark}
                    initial={reduce ? false : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE,
                      delay: 0.15 + i * 0.12,
                    }}
                  >
                    <CaseRow c={c} index={FEATURED.length + i} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-14 flex justify-center lg:mt-20">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="case-studies-more"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] px-7 text-[14px] font-semibold text-[var(--color-ink)] transition-colors duration-300 hover:border-[var(--color-ink)]/25 hover:bg-[var(--color-brand-subtle)]"
          >
            {open ? "Show fewer collaborations" : "Read more collaborations"}
            <CaretDown
              size={14}
              weight="bold"
              aria-hidden="true"
              className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                open ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
