"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, EnvelopeSimple, Phone, MapPin, Flask, Handshake } from "@phosphor-icons/react";
import { COMPANY } from "@/lib/machines";
import { LiquidGlass } from "@/components/ui/liquid-glass";

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
      className="relative bg-[var(--color-dark-bg)] py-24 lg:py-32 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-[-8%] h-[460px] w-[460px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, #1c3a63, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-6%] h-[420px] w-[420px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(closest-side, #2d81e4, transparent)" }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div {...rise(0)} className="flex flex-col gap-4 max-w-3xl mb-14">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-dark-brand)]">
            Get in touch
          </p>
          <h2
            id="connect-heading"
            className="font-display text-[2.2rem] lg:text-[3.2rem] font-semibold tracking-[-0.025em] text-[var(--color-dark-ink)] leading-[1.08]"
          >
            Let&rsquo;s print a better future, together.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Researchers */}
          <motion.div {...rise(0.05)}>
            <LiquidGlass tint="dark" interactive distort={false} className="h-full rounded-2xl border border-white/10">
              <div className="flex flex-col gap-5 p-8 lg:p-10">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#13263d]">
                  <Flask size={22} weight="duotone" className="text-[var(--color-dark-brand)]" />
                </span>
                <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--color-dark-ink)]">
                  For researchers & clinicians
                </h3>
                <p className="text-[15px] text-[var(--color-dark-ink-muted)] leading-relaxed max-w-[44ch]">
                  Find the Trivima system that fits your work, compare specs, and request a
                  quote or live demo. Installation, training and support are included.
                </p>
                <div className="mt-1 flex flex-wrap gap-3">
                  <Link
                    href="/trivima"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-brand-hover)]"
                  >
                    Explore bioprinters
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                  <Link
                    href="/trivima#contact"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--color-dark-border)] px-5 text-[14px] font-medium text-[var(--color-dark-ink)] transition-colors hover:border-[var(--color-dark-brand)]"
                  >
                    Request a demo
                  </Link>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Partners & investors */}
          <motion.div {...rise(0.12)}>
            <LiquidGlass tint="dark" interactive distort={false} className="h-full rounded-2xl border border-white/10">
              <div className="flex flex-col gap-5 p-8 lg:p-10">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#13263d]">
                  <Handshake size={22} weight="duotone" className="text-[var(--color-dark-brand)]" />
                </span>
                <h3 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--color-dark-ink)]">
                  For partners & investors
                </h3>
                <p className="text-[15px] text-[var(--color-dark-ink-muted)] leading-relaxed max-w-[44ch]">
                  Distribution, research collaborations, institutional deployments and
                  investment. We would like to hear what you are building.
                </p>
                <div className="mt-1 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${COMPANY.email}?subject=Partnership%20enquiry`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--color-brand-hover)]"
                  >
                    Start a conversation
                    <ArrowRight size={16} weight="bold" />
                  </a>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>
        </div>

        {/* Contact line */}
        <motion.div
          {...rise(0.18)}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[var(--color-dark-border)] pt-8"
        >
          {[
            { icon: EnvelopeSimple, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
            { icon: Phone, label: "Phone", value: COMPANY.phone, href: `tel:${COMPANY.phoneHref}` },
            {
              icon: MapPin,
              label: "Location",
              value: `${COMPANY.address.line1}, ${COMPANY.address.city}`,
              href: undefined as string | undefined,
            },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} weight="duotone" className="mt-0.5 shrink-0 text-[var(--color-dark-brand)]" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#6f87a3]">{label}</span>
                {href ? (
                  <a href={href} className="text-[14px] text-[var(--color-dark-ink)] hover:text-[var(--color-dark-brand)] transition-colors leading-relaxed">
                    {value}
                  </a>
                ) : (
                  <span className="text-[14px] text-[var(--color-dark-ink-muted)] leading-relaxed">{value}</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
