"use client";

import { motion, useReducedMotion } from "motion/react";
import { EnvelopeSimple, MapPin, Sliders, Wrench, Headset } from "@phosphor-icons/react";
import QuoteForm from "@/app/components/forms/QuoteForm";
import { COMPANY, formatAddress } from "@/lib/machines";

const CONTACTS = [
  {
    icon: EnvelopeSimple,
    label: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}` as string | undefined,
  },
  {
    icon: MapPin,
    label: "Location",
    value: formatAddress(),
    href: undefined,
  },
];

/** What a lab actually gets, spelled out next to the form. Configurability is
 *  the range's main selling point, so it leads: see the `customisation` field
 *  on each machine in `lib/machines.ts` for the per-model detail. */
const INCLUDED = [
  {
    icon: Sliders,
    title: "Configured to your protocol",
    body: "Extruder count, print heads, build volume, fixtures and crosslinking wavelengths are specified with you before we build.",
  },
  {
    icon: Wrench,
    title: "Installation and training",
    body: "Post-sales installation and hands-on training for your team, included with every bioprinter.",
  },
  {
    icon: Headset,
    title: "Technical support",
    body: "Direct access to the engineers who build the machine, for as long as you run it.",
  },
];

/** `defaultModel` preselects a bioprinter in the form: machine pages pass
 *  their own model so the enquiry arrives already scoped. */
export default function ContactSection({ defaultModel }: { defaultModel?: string } = {}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 lg:py-28 bg-[var(--color-surface)] border-t border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* The form runs far taller than the copy beside it, which used to
            leave a column of dead space. The copy now sticks while the form
            scrolls past it, and carries enough substance to earn its half. */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">

          {/* Left: CTA copy, pinned while the form moves */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <motion.h2
              id="contact-heading"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2rem] lg:text-[2.75rem] font-display font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.15]"
            >
              Find the right Trivima for your lab
            </motion.h2>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-[1rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[46ch]"
            >
              Request a quote, schedule a live demo, or discuss a custom
              configuration across any bioprinter in the Trivima range. Every
              machine we ship is built around the work it is going to do.
            </motion.p>

            {/* What comes with the machine */}
            <motion.ul
              role="list"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 border-t border-[var(--color-hairline)] pt-6"
            >
              {INCLUDED.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-surface)]">
                    <Icon size={15} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] font-semibold text-[var(--color-ink)]">{title}</p>
                    <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)] max-w-[46ch]">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ul>

            {/* Contact details */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 border-t border-[var(--color-hairline)] pt-6 sm:flex-row sm:gap-10"
            >
              {CONTACTS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-[var(--color-brand-surface)] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-[14px] text-[var(--color-ink)] hover:text-[var(--color-brand-strong)] transition-colors leading-relaxed"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[32ch]">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: quote request form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 sm:p-8 flex flex-col gap-5"
          >
            <h3 className="text-[17px] font-display font-semibold text-[var(--color-ink)] tracking-[-0.015em]">
              Request a quote or demo
            </h3>

            <QuoteForm defaultModel={defaultModel} />

            <p className="text-[11px] text-[var(--color-ink-faint)] text-center leading-relaxed">
              Expect a reply from our team within 2 business days.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
