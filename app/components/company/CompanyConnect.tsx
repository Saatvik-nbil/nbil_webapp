"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Flask, Handshake } from "@phosphor-icons/react";
import { COMPANY } from "@/lib/machines";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CompanyConnect() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { delay, duration: 0.6, ease: EASE },
        };

  return (
    <section
      id="connect"
      aria-labelledby="connect-heading"
      className="relative bg-[var(--color-warm-bg)] py-24 lg:py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-[-8%] h-[460px] w-[460px] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(closest-side, #ddd0b2, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-6%] h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-surface), transparent)" }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div {...rise(0)} className="flex flex-col gap-4 max-w-3xl mb-14">
          <h2
            id="connect-heading"
            className="h2"
          >
            Let&rsquo;s print a better future, together.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Researchers */}
          <motion.div {...rise(0.05)}>
            <LiquidGlass tint="light" interactive className="h-full rounded-2xl border border-[var(--color-warm-border)]">
              <div className="flex flex-col gap-5 p-8 lg:p-10">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                  <Flask size={22} weight="duotone" className="text-[var(--color-warm-brand)]" />
                </span>
                <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--color-warm-ink)]">
                  For researchers & clinicians
                </h3>
                <p className="text-[15px] text-[var(--color-warm-ink-muted)] leading-relaxed max-w-[44ch]">
                  Find the Trivima bioprinter that fits your work, compare specs, and
                  request a quote or live demo. Installation, training and support are
                  included.
                </p>
                <div className="mt-1 flex flex-wrap gap-3">
                  <OriginButton
                    href="/trivima"
                    className="h-11 px-5 text-[14px]"
                  >
                    Explore bioprinters
                    <ArrowRight size={16} weight="bold" />
                  </OriginButton>
                  <OriginButton
                    href="/trivima#contact"
                    variant="outline"
                    className="h-11 border-[var(--color-warm-border)] bg-transparent px-5 text-[14px] text-[var(--color-warm-ink)]"
                  >
                    Request a demo
                  </OriginButton>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Partners */}
          <motion.div {...rise(0.12)}>
            <LiquidGlass tint="light" interactive className="h-full rounded-2xl border border-[var(--color-warm-border)]">
              <div className="flex flex-col gap-5 p-8 lg:p-10">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                  <Handshake size={22} weight="duotone" className="text-[var(--color-warm-brand)]" />
                </span>
                <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--color-warm-ink)]">
                  For partners
                </h3>
                <p className="text-[15px] text-[var(--color-warm-ink-muted)] leading-relaxed max-w-[44ch]">
                  Distribution, research collaborations and institutional deployments.
                  We would like to hear what you are building.
                </p>
                <div className="mt-1 flex flex-wrap gap-3">
                  <OriginButton
                    href={`mailto:${COMPANY.email}?subject=Partnership%20enquiry`}
                    className="h-11 px-5 text-[14px]"
                  >
                    Start a conversation
                    <ArrowRight size={16} weight="bold" />
                  </OriginButton>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
