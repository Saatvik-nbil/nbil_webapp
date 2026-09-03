"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sliders } from "@phosphor-icons/react";
import type { Machine } from "@/lib/machines";

const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The three bioprinters as one row of cards. Hovering (or tab-focusing) a card
 * takes it to roughly half the row and squeezes the other two, revealing that
 * model's numbers, key specs, technologies and what can be configured on it.
 *
 * The row keeps a fixed height above `lg`, so widening a card never pushes the
 * rest of the page around: only the widths and the revealed block animate, both
 * on the same ease-in-out curve.
 *
 * Below `lg` there is no hover to speak of, so the cards stack and every one of
 * them is fully expanded.
 */

/** Spec rows a card shows when it opens: what a lab compares first, not the
 *  full table (that lives on the model page). */
const SPEC_PRIORITY = [
  "extruder slots",
  "extruder technologies",
  "technology",
  "print resolution",
  "movement precision",
  "build volume",
  "pressure range",
  "bed temperature",
  "photo-crosslinking",
];

function keySpecs(machine: Machine, limit = 4) {
  const picked: Machine["specs"] = [];
  for (const keyword of SPEC_PRIORITY) {
    if (picked.length >= limit) break;
    const hit = machine.specs.find(
      (s) => s.label.toLowerCase().includes(keyword) && !picked.includes(s),
    );
    if (hit) picked.push(hit);
  }
  return picked.length ? picked : machine.specs.slice(0, limit);
}

/** Label / value line, used for both the headline numbers and the spec rows. */
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-hairline)] pb-1.5 last:border-b-0">
      <dt className="shrink-0 text-[11.5px] text-[var(--color-ink-faint)]">{label}</dt>
      <dd className="text-right text-[12.5px] font-medium text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export default function ModelsRow({ machines }: { machines: Machine[] }) {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div
      className="flex flex-col gap-5 lg:h-[620px] lg:flex-row lg:gap-4"
      onPointerLeave={() => setActive(null)}
    >
      {machines.map((machine, i) => {
        const isActive = active === machine.slug;
        // Nothing hovered: equal thirds. Hovering one takes it to ~54% of the
        // row and drops the other two to ~23% each.
        const flexGrow = active === null ? 1 : isActive ? 1.9 : 0.8;
        const specs = keySpecs(machine);
        const restStats = machine.stats.slice(2);

        return (
          <motion.article
            key={machine.slug}
            data-active={isActive}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: REVEAL_EASE }}
            style={{ flexGrow, transitionTimingFunction: EASE_IN_OUT }}
            onPointerEnter={() => setActive(machine.slug)}
            onFocusCapture={() => setActive(machine.slug)}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] transition-[flex-grow,border-color,box-shadow] duration-[550ms] data-[active=true]:border-[var(--color-brand)] data-[active=true]:shadow-[0_20px_60px_rgba(15,23,42,0.12)] motion-reduce:transition-none lg:basis-0 lg:min-w-[250px]"
          >
            <Link
              href={`/machines/${machine.slug}`}
              className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
            >
              {/* Image well. `min-h-0` lets it give space back to the content
                  when a card opens, so the taller expanded body never spills
                  past the fixed row height. */}
              <div className="relative flex min-h-[150px] flex-1 items-center justify-center bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)] p-6 lg:min-h-0">
                <span className="absolute left-4 top-4 z-[1] rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[11px] font-medium text-white">
                  {machine.role}
                </span>
                <Image
                  src={machine.heroImage.src}
                  alt={machine.heroImage.alt}
                  width={520}
                  height={520}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="max-h-full w-auto object-contain transition-transform duration-[550ms] group-data-[active=true]:scale-[1.04] motion-reduce:transition-none"
                  style={{ transitionTimingFunction: EASE_IN_OUT }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-3.5 border-t border-[var(--color-hairline)] p-5 lg:p-6">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {machine.customisation ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-surface)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-brand-strong)]">
                        <Sliders size={11} weight="bold" aria-hidden="true" />
                        Customisable
                      </span>
                    ) : null}
                    <span className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                      {machine.tier}
                    </span>
                  </div>
                  <h3 className="font-display text-[1.3rem] font-semibold tracking-[-0.02em] leading-tight text-[var(--color-ink)]">
                    {machine.name}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                    {machine.tagline}
                  </p>
                </div>

                {/* The two headline numbers stay visible in both states, so a
                    collapsed card is still worth reading. */}
                <dl className="flex flex-col gap-1.5">
                  {machine.stats.slice(0, 2).map((s) => (
                    <DataRow
                      key={s.label}
                      label={s.label}
                      value={`${s.value}${s.unit ? ` ${s.unit}` : ""}`}
                    />
                  ))}
                </dl>

                {/* Everything else, revealed on hover above lg and always open
                    below it. The grid-rows 0fr to 1fr trick animates a block of
                    unknown height without hard-coding one. */}
                <div
                  className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-[550ms] motion-reduce:transition-none lg:grid-rows-[0fr] lg:opacity-0 lg:group-data-[active=true]:grid-rows-[1fr] lg:group-data-[active=true]:opacity-100"
                  style={{ transitionTimingFunction: EASE_IN_OUT }}
                >
                  <div className="flex min-h-0 flex-col gap-3.5 overflow-hidden">
                    <dl className="flex flex-col gap-1.5">
                      {restStats.map((s) => (
                        <DataRow
                          key={s.label}
                          label={s.label}
                          value={`${s.value}${s.unit ? ` ${s.unit}` : ""}`}
                        />
                      ))}
                      {specs.map((s) => (
                        <DataRow key={s.label} label={s.label} value={s.value} />
                      ))}
                    </dl>

                    <div className="flex flex-wrap gap-1.5">
                      {machine.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--color-hairline)] px-2.5 py-1 text-[11.5px] text-[var(--color-ink-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                      {machine.technologies.length > 3 ? (
                        <span className="rounded-full px-1.5 py-1 text-[11.5px] text-[var(--color-ink-faint)]">
                          +{machine.technologies.length - 3} more
                        </span>
                      ) : null}
                    </div>

                    {machine.customisation ? (
                      <p className="rounded-xl bg-[var(--color-brand-subtle)] px-3.5 py-2.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                        <span className="font-semibold text-[var(--color-brand-strong)]">
                          Built to your spec.
                        </span>{" "}
                        {machine.customisation.summary}
                      </p>
                    ) : null}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--color-brand-strong)]">
                  View full specifications
                  <ArrowUpRight
                    size={15}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  />
                </span>
              </div>
            </Link>
          </motion.article>
        );
      })}
    </div>
  );
}
