"use client";

import { motion, useReducedMotion } from "motion/react";
import { FileCode, Sliders, GitBranch, SealCheck } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const SUITES = [
  {
    name: "Dhee",
    on: "NP · Aura · Mini",
    body: "Generates non-planar and rotary toolpaths, with per-extruder parameter control and real-time crosslinking synchronization.",
  },
  {
    name: "Niyantranam",
    on: "Basic · Advanced · Pro",
    body: "Drives multi-extruder workflows with coordinated temperature, pressure and well-plate motion control.",
  },
];

const CAPABILITIES = [
  { icon: FileCode, title: "Multi-format import", body: "Load .stl, .obj, .gcode and .amf directly. No conversion step." },
  { icon: Sliders, title: "Per-extruder control", body: "Independent temperature, pressure and speed for every head." },
  { icon: GitBranch, title: "Non-planar paths", body: "Automatic toolpaths for rotary and curved scaffold geometries." },
  { icon: SealCheck, title: "Crosslinking sync", body: "UV exposure timed to extrusion for consistent gelation." },
];

export default function CatalogSoftware() {
  const reduce = useReducedMotion();

  return (
    <section
      id="software"
      aria-labelledby="software-heading"
      className="py-20 lg:py-28"
      style={{ background: "var(--color-dark-bg)" }}
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
              className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] leading-[1.12]"
              style={{ color: "var(--color-dark-ink)" }}
            >
              Every machine ships with its own control suite
            </motion.h2>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.07, duration: 0.6, ease: EASE }}
              className="text-[0.9375rem] leading-relaxed max-w-[48ch]"
              style={{ color: "var(--color-dark-ink-muted)" }}
            >
              Dhee powers the non-planar and light-based systems; Niyantranam drives the
              multi-extruder extrusion range. Both handle slicing and machine control in
              one place.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
              {SUITES.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: EASE }}
                  className="p-5 rounded-2xl flex flex-col gap-2"
                  style={{ background: "var(--color-dark-surface)", border: "1px solid var(--color-dark-border)" }}
                >
                  <p className="font-display text-[19px] font-semibold" style={{ color: "var(--color-dark-ink)" }}>
                    {s.name}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--color-dark-brand)" }}>{s.on}</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--color-dark-ink-muted)" }}>
                    {s.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: capabilities as a single panel with separated rows */}
          <motion.dl
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.65, ease: EASE }}
            className="rounded-2xl overflow-hidden divide-y divide-[var(--color-dark-border)]"
            style={{ border: "1px solid var(--color-dark-border)" }}
          >
            {CAPABILITIES.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 p-6"
                style={{ background: "var(--color-dark-surface)", borderColor: "var(--color-dark-border)" }}
              >
                <c.icon size={20} weight="duotone" style={{ color: "var(--color-dark-brand)" }} aria-hidden="true" className="mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <dt className="text-[14px] font-semibold" style={{ color: "var(--color-dark-ink)" }}>
                    {c.title}
                  </dt>
                  <dd className="text-[13px] leading-relaxed" style={{ color: "var(--color-dark-ink-muted)" }}>
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
