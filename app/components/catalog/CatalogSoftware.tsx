"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  FileCode,
  Sliders,
  GitBranch,
  SealCheck,
} from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    title: "Non-planar, multi-extruder toolpaths",
    body: "Automatic path generation for rotary and curved scaffold geometries, with no manual toolpath correction needed.",
  },
  {
    title: "Per-extruder control",
    body: "Independent temperature, pressure, and speed settings for every printhead, adjustable in real time.",
  },
  {
    title: "Synchronized crosslinking",
    body: "UV exposure timed directly to extrusion, so gelation stays consistent from the first layer to the last.",
  },
  {
    title: "Direct import",
    body: ".stl and .gcode load straight in. No conversion step, no intermediate file format.",
  },
];

const CAPABILITIES = [
  { icon: FileCode, title: "Direct import", body: "Load .stl and .gcode directly (.stl and .bmp on Aura). No conversion step." },
  { icon: Sliders, title: "Per-extruder control", body: "Independent temperature, pressure and speed for every head." },
  { icon: GitBranch, title: "Non-planar paths", body: "Automatic toolpaths for rotary and curved scaffold geometries." },
  { icon: SealCheck, title: "Synchronized crosslinking", body: "UV exposure timed to extrusion for consistent gelation." },
];

export default function CatalogSoftware() {
  const reduce = useReducedMotion();

  return (
    <section
      id="software"
      aria-labelledby="software-heading"
      className="py-20 lg:py-28"
      style={{ background: "var(--color-warm-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: copy + suites */}
          <div className="flex flex-col gap-6">
            <motion.h2
              id="software-heading"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="h2"
              style={{ color: "var(--color-warm-ink)" }}
            >
              Stop switching between software. Run every print from one place.
            </motion.h2>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.07, duration: 0.6, ease: EASE }}
              className="text-[0.9375rem] leading-relaxed max-w-[52ch]"
              style={{ color: "var(--color-warm-ink-muted)" }}
            >
              Your bioprinting workflow shouldn&rsquo;t need to juggle three
              different pieces of software to get one scaffold out.{" "}
              <Link
                href="/dhee-slicer"
                className="font-medium underline underline-offset-4 hover:no-underline"
                style={{ color: "var(--color-warm-brand)" }}
              >
                Dhee
              </Link>
              , our in-house slicer, handles the entire process end to end,
              built specifically for the way Trivima printers actually work.
              <a
                href="#dhee-licensing"
                aria-label="See licensing note"
                className="align-super text-[11px] no-underline"
                style={{ color: "var(--color-warm-brand)" }}
              >
                *
              </a>
            </motion.p>

            {/* Feature copy: deliberately unadorned, so it reads as prose next
                to the boxed capability panel rather than repeating its card
                treatment. */}
            <div className="mt-1 flex flex-col gap-1">
              <h3
                className="mb-3 font-display text-[17px] font-semibold"
                style={{ color: "var(--color-warm-brand)" }}
              >
                Dhee features
              </h3>
              <dl className="flex flex-col divide-y divide-[var(--color-warm-border)] border-t border-[var(--color-warm-border)]">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      delay: 0.1 + i * 0.06,
                      duration: 0.5,
                      ease: EASE,
                    }}
                    className="flex flex-col gap-1.5 py-5"
                  >
                    <dt
                      className="text-[1.0625rem] font-semibold"
                      style={{ color: "var(--color-warm-ink)" }}
                    >
                      {f.title}
                    </dt>
                    <dd
                      className="text-[15px] leading-relaxed"
                      style={{ color: "var(--color-warm-ink-muted)" }}
                    >
                      {f.body}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>

            <p
              id="dhee-licensing"
              className="scroll-mt-28 text-[12.5px] leading-relaxed"
              style={{ color: "var(--color-warm-ink-muted)" }}
            >
              *Dhee is licensed separately from Trivima hardware.{" "}
              <Link
                href="/dhee-slicer"
                className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:no-underline"
                style={{ color: "var(--color-warm-brand)" }}
              >
                See pricing and compatibility
                <ArrowRight size={12} weight="bold" aria-hidden="true" />
              </Link>
            </p>
          </div>

          {/* Right: capabilities as a single panel with separated rows */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.65, ease: EASE }}
            /* Sticky: the feature copy on the left is now much taller than
               this panel, which otherwise left a large void beside it. */
            className="rounded-2xl overflow-hidden divide-y divide-[var(--color-warm-border)] lg:sticky lg:top-28"
            style={{ border: "1px solid var(--color-warm-border)" }}
          >
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 p-6"
                style={{ background: "var(--color-warm-surface)", borderColor: "var(--color-warm-border)" }}
              >
                <c.icon size={20} weight="duotone" style={{ color: "var(--color-warm-brand)" }} aria-hidden="true" className="mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <dt className="text-[14px] font-semibold" style={{ color: "var(--color-warm-ink)" }}>
                    {c.title}
                  </dt>
                  <dd className="text-[13px] leading-relaxed" style={{ color: "var(--color-warm-ink-muted)" }}>
                    {c.body}
                  </dd>
                </div>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
