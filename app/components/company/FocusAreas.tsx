"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Pill, Heartbeat, Tree } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const AREAS = [
  {
    icon: Pill,
    title: "Drug development",
    body: "Physiologically relevant tissue models that let researchers test compounds on human-like constructs instead of flat cell cultures.",
  },
  {
    icon: Heartbeat,
    title: "Regenerative medicine",
    body: "Scaffolds and grafts that guide the body to repair, restore and rebuild damaged tissue.",
  },
  {
    icon: Tree,
    title: "Bioengineered organs",
    body: "The long horizon: vascularised, transplant-ready tissue, fabricated layer by layer to close the organ-donor gap.",
  },
];

export default function FocusAreas() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="focus-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="lg:col-span-5 order-2 lg:order-1"
        >
          <div className="relative rounded-[1.75rem] overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-surface-raised)]">
            <Image
              src="/images/applications.png"
              alt="Tissue constructs and scaffolds bioprinted on NBIL systems"
              width={900}
              height={760}
              className="w-full h-auto object-cover"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
        </motion.div>

        {/* Copy */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              What we enable
            </p>
            <h2
              id="focus-heading"
              className="font-display text-[2rem] lg:text-[2.6rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              Tools for the work that matters
            </h2>
            <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[52ch]">
              NBIL builds bioprinting solutions for researchers and clinicians working at
              the edge of medicine. Three problems anchor everything we make.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-[var(--color-hairline)] border-t border-[var(--color-hairline)]">
            {AREAS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                className="flex items-start gap-4 py-5"
              >
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                  <Icon size={20} weight="duotone" className="text-[var(--color-brand-strong)]" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                    {title}
                  </h3>
                  <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[54ch]">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
