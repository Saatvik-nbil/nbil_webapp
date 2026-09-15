"use client";

import { motion, useReducedMotion } from "motion/react";
import MobileCollapse from "@/components/ui/mobile-collapse";

const EASE = [0.16, 1, 0.3, 1] as const;

/** A composite of a real consultancy engagement. The institution, the people
    and every commercial term are deliberately left out. */
const STAGES = [
  {
    step: "01",
    title: "We scope the brief before anything is quoted",
    body: "A doctoral researcher arrives with a silk fibroin scaffold carrying a loaded drug, four supporting biomaterial blends, and a geometry that exists only as a sketch. We agree on what gets designed, what gets optimised, and what gets printed. Only then does a line-by-line quote go out.",
  },
  {
    step: "02",
    title: "A design engineer builds the geometry",
    body: "The scaffold is modelled from the researcher's inputs, then edited against what a bioprinting protocol can actually hold: wall thickness, pore strategy, and the toolpath the printhead needs to follow. Starting from a sketch rather than an existing CAD file is what sets the scope at this stage.",
  },
  {
    step: "03",
    title: "A biofabrication engineer optimises the print",
    body: "Design, biomaterial, and G-code are worked together on a Trivima bioprinter: formulation adjustment, layer strategy, flow and pressure, retraction. The full print protocol for the lead material is finalised here, not left for the researcher to reverse-engineer later.",
  },
  {
    step: "04",
    title: "Supporting blends are optimised in parallel",
    body: "The four supporting biomaterial blends run through their own optimisation pass, so the researcher leaves with printable parameters for every material in the study, not just the lead one. Each blend is quoted separately, so any can be dropped if the study narrows.",
  },
  {
    step: "05",
    title: "Scaffolds are printed and shipped",
    body: "Thirty scaffolds are printed against the finalised protocol for the lead material, with a smaller batch per supporting blend, then packed and shipped to the lab. What arrives is the print, the protocol that produced it, and the parameter file to reproduce it.",
  },
  {
    step: "06",
    title: "A complete, detailed report",
    body: "A written project report documents which parameters were abandoned and why, where the formulation resisted the printhead, and what we would change if the material were reformulated. Failures are included because they are what saves the next run.",
  },
];

export default function ConsultancyWalkthrough() {
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      aria-labelledby="walkthrough-heading"
      className="bg-[var(--color-surface-raised)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-4 max-w-2xl mb-14 lg:mb-18"
        >
          <h2
            id="walkthrough-heading"
            className="h2"
          >
            Project walkthrough
          </h2>
          <p className="text-[15px] lg:text-[16px] text-[var(--color-ink-muted)] leading-[1.7]">
            A representative example of how a project runs. Actual scope,
            quantities and timeline vary by project.
          </p>
        </motion.div>

        <MobileCollapse
          collapsedHeight={760}
          moreLabel="Read the rest of the walkthrough"
          lessLabel="Show less"
          fadeTo="var(--color-surface-raised)"
        >
        <ol className="relative flex flex-col gap-10 lg:gap-12 border-l border-[var(--color-hairline)] pl-8 lg:pl-12">
          {STAGES.map(({ step, title, body }, i) => (
            <motion.li
              key={step}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 3) * 0.06, duration: 0.55, ease: EASE }}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="absolute -left-9 lg:-left-14 top-0 flex size-11 lg:size-12 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] text-[17px] lg:text-[19px] font-semibold tabular-nums text-[var(--color-brand-strong)]"
              >
                {step}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-[1.2rem] lg:text-[1.35rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-[1.25]">
                  {title}
                </h3>
                <p className="text-[15px] text-[var(--color-ink-muted)] leading-[1.75] max-w-[68ch]">
                  {body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
        </MobileCollapse>
      </div>
    </section>
  );
}
