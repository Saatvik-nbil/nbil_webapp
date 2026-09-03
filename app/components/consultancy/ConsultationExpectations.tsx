"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Target,
  TestTube,
  Cube,
  Flask,
  GearSix,
} from "@phosphor-icons/react";
import ShaderBackground from "@/components/ui/shader-background";

const EASE = [0.16, 1, 0.3, 1] as const;

const POINTS = [
  {
    icon: Target,
    text: "Identifying the most suitable bioprinting platform and compatible printheads",
  },
  {
    icon: TestTube,
    text: "Selecting biomaterials tailored for your specific cell type or tissue model",
  },
  {
    icon: Cube,
    text: "Understanding which cells, media, and bioinks best support your application",
  },
  {
    icon: Flask,
    text: "Planning fabrication strategies for tissue- or disease-specific models",
  },
  {
    icon: GearSix,
    text: "Addressing any technical or experimental considerations relevant to your workflow",
  },
];

export default function ConsultationExpectations() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="expect-heading"
      className="relative overflow-hidden bg-[var(--color-dark-bg)] py-24 lg:py-32"
    >
      {/* Animated shader background: the same plasma waves used behind the
          mission statement on the homepage. Held at 50% so the copy and
          icons stay legible over it. */}
      <ShaderBackground className="pointer-events-none absolute inset-0 h-full w-full opacity-50" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center text-center gap-5 mb-14"
        >
          <span className="h-[3px] w-12 rounded-full bg-[var(--color-dark-brand)]" />
          <h2
            id="expect-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-dark-ink)] leading-[1.12] max-w-[20ch]"
          >
            What can you expect from the consultation?
          </h2>
          <p className="text-[15.5px] text-[var(--color-dark-ink-muted)] leading-relaxed max-w-[62ch]">
            This session is designed to help us understand your research
            objectives, challenges, and the outcomes you&rsquo;re aiming for.
            Every project is unique, and our goal is to guide you toward the most
            suitable bioprinting and biofabrication workflow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6 max-w-3xl mx-auto">
          {POINTS.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 2) * 0.06, duration: 0.5, ease: EASE }}
              className="flex items-start gap-3.5"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#13263d]">
                <Icon size={18} weight="duotone" className="text-[var(--color-dark-brand)]" />
              </span>
              <p className="text-[14.5px] text-[var(--color-dark-ink-muted)] leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-16 text-center font-display text-[1.25rem] lg:text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--color-dark-ink)] leading-[1.3] max-w-[34ch] mx-auto"
        >
          We look forward to engaging with you and shaping the future of
          bioprinting together.
        </motion.p>
      </div>
    </section>
  );
}
