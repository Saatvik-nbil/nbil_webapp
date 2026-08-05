"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  EnvelopeSimple,
  CalendarCheck,
  Flask,
  Lightbulb,
  CaretDown,
} from "@phosphor-icons/react";
import { COMPANY } from "@/lib/machines";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Singapore",
  "Australia",
  "Other",
];

const AREAS = [
  "Bone Tissue Engineering",
  "Cartilage & Osteochondral",
  "Skin & Wound Healing",
  "Vascular & Cardiac",
  "Drug Discovery & Toxicology",
  "Organ-on-a-Chip",
  "Other",
];

const TIMELINES = ["Immediate", "3–6 Months", "6+ Months"] as const;

const EXPECT = [
  {
    icon: EnvelopeSimple,
    title: "Instant Confirmation",
    body: "Receive a confirmation email with our initial technical questionnaire.",
  },
  {
    icon: CalendarCheck,
    title: "Scheduled Call",
    body: "Pick a slot that works for you.",
  },
  {
    icon: Flask,
    title: "Tailored Demo",
    body: "A custom walkthrough of bioprinting solutions for your specific tissue model.",
  },
];

const LABEL = "text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)]";
const FIELD =
  "h-11 w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-3.5 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none transition-colors focus:border-[var(--color-brand)] focus:ring-3 focus:ring-[var(--color-brand)]/15";

export default function ProjectForm() {
  const reduce = useReducedMotion();
  const [timeline, setTimeline] = useState<(typeof TIMELINES)[number]>("Immediate");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => (data.get(k) as string) || "—";
    const body = [
      `First name: ${get("firstName")}`,
      `Last name: ${get("lastName")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `Organization / Company: ${get("organization")}`,
      `Job title: ${get("jobTitle")}`,
      `Country: ${get("country")}`,
      `Area of interest: ${get("areaOfInterest")}`,
      `Expected project timeline: ${timeline}`,
      "",
      "Message:",
      get("message"),
    ].join("\n");
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
      "Consultation request",
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section
      id="project-form"
      aria-labelledby="project-form-heading"
      className="scroll-mt-24 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Form card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-3xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-7 sm:p-10 shadow-[0_18px_50px_rgba(2,12,27,0.08)]"
          >
            <h2
              id="project-form-heading"
              className="font-display text-[1.75rem] lg:text-[2.1rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)]"
            >
              Tell Us About Your Project
            </h2>
            <p className="mt-2 text-[13.5px] text-[var(--color-brand-strong)]">
              Fields marked with <span aria-hidden="true">*</span> are required for our analysis.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="firstName" className={LABEL}>First name *</label>
                  <input id="firstName" name="firstName" required placeholder="John" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lastName" className={LABEL}>Last name *</label>
                  <input id="lastName" name="lastName" required placeholder="Doe" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className={LABEL}>Email address *</label>
                  <input id="email" name="email" type="email" required placeholder="john@university.edu" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className={LABEL}>Phone number</label>
                  <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="organization" className={LABEL}>Organization / Company *</label>
                  <input id="organization" name="organization" required placeholder="IIT Delhi / Merck" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="jobTitle" className={LABEL}>Job title</label>
                  <input id="jobTitle" name="jobTitle" placeholder="Lead Researcher" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className={LABEL}>Country *</label>
                  <div className="relative">
                    <select id="country" name="country" required defaultValue="India" className={`${FIELD} appearance-none pr-9`}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <CaretDown size={15} weight="bold" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="areaOfInterest" className={LABEL}>Area of interest</label>
                  <div className="relative">
                    <select id="areaOfInterest" name="areaOfInterest" defaultValue="Bone Tissue Engineering" className={`${FIELD} appearance-none pr-9`}>
                      {AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <CaretDown size={15} weight="bold" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                  </div>
                </div>
              </div>

              {/* Timeline segmented control */}
              <div className="flex flex-col gap-2">
                <span className={LABEL}>Expected project timeline</span>
                <div className="inline-flex flex-wrap gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] p-1.5">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeline(t)}
                      aria-pressed={timeline === t}
                      className={[
                        "h-9 rounded-lg px-4 text-[13.5px] font-medium transition-colors",
                        timeline === t
                          ? "bg-[var(--color-brand)] text-white"
                          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className={LABEL}>Detailed message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Briefly describe your research objectives and current challenges…"
                  className={`${FIELD} h-auto resize-y py-3 leading-relaxed`}
                />
              </div>

              <OriginButton
                type="submit"
                className="mt-2 h-13 px-6 py-3.5 font-semibold"
              >
                Send Consultation Request
              </OriginButton>
            </form>
          </motion.div>

          {/* What to Expect */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="lg:sticky lg:top-28 flex flex-col gap-8"
          >
            <h3 className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              What to expect?
            </h3>

            <ol className="relative flex flex-col gap-7 border-l border-[var(--color-hairline)] pl-7">
              {EXPECT.map(({ icon: Icon, title, body }) => (
                <li key={title} className="relative">
                  <span className="absolute -left-[calc(1.75rem+1px)] flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-brand-surface)]">
                    <Icon size={16} weight="duotone" className="text-[var(--color-brand-strong)]" />
                  </span>
                  <p className="text-[14.5px] font-semibold text-[var(--color-ink)]">{title}</p>
                  <p className="mt-1 text-[13.5px] text-[var(--color-ink-muted)] leading-relaxed">
                    {body}
                  </p>
                </li>
              ))}
            </ol>

            {/* Did you know */}
            <div className="flex gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                <Lightbulb size={20} weight="duotone" className="text-[var(--color-brand-strong)]" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">Did you know?</p>
                <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                  Implementing the right scaffold architecture can reduce
                  experimental variability by up to 45% in complex cell cultures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
