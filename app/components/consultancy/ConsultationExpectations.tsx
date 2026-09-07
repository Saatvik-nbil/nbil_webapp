"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChatsCircle, Package, Receipt } from "@phosphor-icons/react";
import ShaderBackground from "@/components/ui/shader-background";

const EASE = [0.16, 1, 0.3, 1] as const;

const BLOCKS = [
  {
    icon: ChatsCircle,
    title: "What We Actually Discuss",
    body: "Your biology (cell type, what's failed, what matters most), your constraints (budget, timeline, one-off vs. long-term), and your fabrication path (printhead, biomaterial, standard vs. custom build).",
  },
  {
    icon: Package,
    title: "What You Walk Away With",
    body: "A standard configuration quoted directly and a scoped custom build with cost and timeline.",
  },
  {
    icon: Receipt,
    title: "How We Quote",
    body: "Itemized, not bundled: hardware, biomaterials, engineering hours, training, and validation runs, each priced separately, each removable if it doesn't apply.",
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
            How do we map your protocol
          </h2>
          <p className="text-[15.5px] text-[var(--color-dark-ink-muted)] leading-relaxed max-w-[68ch]">
            Thirty minutes, one engineer, your actual project. We ask about your
            cell type, your current failure point, your budget ceiling, and your
            timeline, and by the end, you&rsquo;ll have three things: a diagnosis
            of what&rsquo;s not working, a written set of options, and a quote
            broken down line by line, not a lump sum.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-x-8 gap-y-10">
          {BLOCKS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
              className="flex flex-col gap-3.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#13263d]">
                <Icon size={18} weight="duotone" className="text-[var(--color-dark-brand)]" />
              </span>
              <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.015em] text-[var(--color-dark-ink)] leading-[1.3]">
                {title}
              </h3>
              <p className="text-[14.5px] text-[var(--color-dark-ink-muted)] leading-relaxed">
                {body}
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
