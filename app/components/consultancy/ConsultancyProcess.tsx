"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  PhoneCall,
  UsersThree,
  FileText,
  ArrowRight,
} from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    icon: PhoneCall,
    title: "Discovery Call",
    body: "We dive deep into your research parameters and current technical roadblocks.",
  },
  {
    icon: UsersThree,
    title: "Expert Matching",
    body: "We align your project with a specialist in your specific biological field.",
  },
  {
    icon: FileText,
    title: "Tailored Recommendation",
    body: "Get a comprehensive roadmap including hardware, bioink, and protocol adjustments.",
  },
];

export default function ConsultancyProcess() {
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-[var(--color-dark-bg)] py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-8%] h-[460px] w-[460px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, #1c3a63, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-6%] h-[420px] w-[420px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(closest-side, #2d81e4, transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center text-center gap-4 mb-14 lg:mb-20"
        >
          <h2
            id="process-heading"
            className="font-display text-[2rem] lg:text-[2.9rem] font-semibold tracking-[-0.025em] text-[var(--color-dark-ink)] leading-[1.1]"
          >
            Our Consultancy Process
          </h2>
          <span className="h-[3px] w-16 rounded-full bg-[var(--color-dark-brand)]" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-4 items-stretch">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative flex">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: EASE }}
                className="flex flex-1 flex-col items-center text-center gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-8 lg:p-10 shadow-[0_18px_50px_rgba(2,12,27,0.25)]"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                  <Icon size={24} weight="duotone" className="text-[var(--color-brand-strong)]" />
                </span>
                <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--color-brand-strong)]">
                  {title}
                </h3>
                <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[30ch]">
                  {body}
                </p>
              </motion.div>

              {/* Connector arrow (between cards on desktop) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden md:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2 translate-x-1/2 size-7 items-center justify-center rounded-full bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] text-[var(--color-dark-brand)]"
                >
                  <ArrowRight size={14} weight="bold" />
                </span>
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 flex justify-center"
        >
          <OriginButton href="#project-form" className="px-6 font-semibold">
            Start your consultation
            <ArrowRight size={16} weight="bold" />
          </OriginButton>
        </motion.div>
      </div>
    </section>
  );
}
