"use client";

import { motion, useReducedMotion } from "motion/react";
import { Lightbulb, Sliders, UsersThree, HandHeart } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const VALUES = [
  { icon: Lightbulb, title: "Innovation", body: "Our cornerstone. We keep pushing the boundary of what bioprinting hardware and software can do." },
  { icon: Sliders, title: "Customization", body: "No two research projects are the same, so our systems and fixtures are built to be tailored." },
  { icon: UsersThree, title: "Collaboration", body: "Progress in science is never made in silos. We work alongside the labs that use our machines." },
  { icon: HandHeart, title: "Empowerment", body: "We support users from first contact through years of operation, training and technical care." },
];

export default function ValuesSection() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="values-heading" className="py-20 lg:py-28 bg-[var(--color-surface-raised)] border-y border-[var(--color-hairline)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-12 lg:mb-16">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
            What we stand for
          </p>
          <h2
            id="values-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Not just a bioprinting company. A community.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-hairline)] border border-[var(--color-hairline)] rounded-2xl overflow-hidden">
          {VALUES.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: (i % 2) * 0.06, duration: 0.5, ease: EASE }}
              className="bg-[var(--color-surface)] p-8 lg:p-10 flex flex-col gap-4"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                <Icon size={22} weight="duotone" className="text-[var(--color-brand-strong)]" />
              </span>
              <h3 className="font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="text-[14.5px] text-[var(--color-ink-muted)] leading-relaxed max-w-[46ch]">
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
