"use client";

import { motion, useReducedMotion } from "motion/react";
import { EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react";
import HubSpotForm from "@/components/ui/hubspot-form";

const CONTACTS = [
  {
    icon: EnvelopeSimple,
    label: "Email",
    value: "support@nextbiginnovationlabs.com",
    href: "mailto:support@nextbiginnovationlabs.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 6364 596 016",
    href: "tel:+916364596016",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Jyothy Institute of Technology, Bengaluru, Karnataka 560082, India",
    href: undefined,
  },
];

export default function ContactSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 lg:py-28 bg-[var(--color-surface)] border-t border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: CTA copy */}
          <div className="flex flex-col gap-6">
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
              className="text-[1rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[44ch]"
            >
              Request a quote, schedule a live demo, or discuss a custom
              configuration across any model in the Trivima range. Post-sales
              installation training and technical support are included with every system.
            </motion.p>

            {/* Contact details */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.14, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 mt-2"
            >
              {CONTACTS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-[var(--color-brand-surface)] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)] mb-0.5">
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
                      <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed">
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
            className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8 flex flex-col gap-5"
          >
            <h3 className="text-[17px] font-display font-semibold text-[var(--color-ink)] tracking-[-0.015em]">
              Request a quote or demo
            </h3>

            <HubSpotForm
              portalId="43589364"
              formId="0f3a8808-5c7d-4a76-9d32-b9af1e9e4c16"
              region="na2"
              targetId="hubspot-trivima-form"
            />

            <p className="text-[11px] text-[var(--color-ink-faint)] text-center leading-relaxed">
              NBIL responds to all inquiries within 2 business days.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
