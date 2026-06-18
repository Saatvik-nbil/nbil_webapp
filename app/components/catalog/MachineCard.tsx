"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Machine } from "@/lib/machines";

const EASE = [0.16, 1, 0.3, 1] as const;

function StatRow({ stats }: { stats: Machine["stats"] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5">
          <dd className="font-mono text-[15px] font-medium text-[var(--color-ink)] leading-none">
            {s.value}
            {s.unit ? (
              <span className="ml-0.5 text-[12px] text-[var(--color-ink-muted)]">{s.unit}</span>
            ) : null}
          </dd>
          <dt className="text-[11px] text-[var(--color-ink-faint)] leading-snug">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Large horizontal card for the specialised / newest models. */
export function FeatureCard({ machine, index }: { machine: Machine; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: EASE }}
    >
      <Link
        href={`/machines/${machine.slug}`}
        className="group grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] transition-all duration-300 hover:border-[var(--color-brand)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
      >
        {/* Image */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)] p-8 min-h-[260px]">
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[11px] font-medium text-white">
            {machine.role}
          </span>
          <Image
            src={machine.heroImage.src}
            alt={machine.heroImage.alt}
            width={520}
            height={520}
            className="max-h-[240px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 90vw, 30vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 p-7 lg:p-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
              <span>{machine.tier}</span>
              <span aria-hidden="true">·</span>
              <span>{machine.year}</span>
            </div>
            <h3 className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight">
              {machine.name}
            </h3>
            <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed">
              {machine.tagline}
            </p>
          </div>

          <StatRow stats={machine.stats} />

          <span className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-brand)]">
            View full specifications
            <ArrowUpRight
              size={16}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Compact vertical card for the core extrusion range. */
export function MachineCard({ machine, index }: { machine: Machine; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: EASE }}
      className="h-full"
    >
      <Link
        href={`/machines/${machine.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] transition-all duration-300 hover:border-[var(--color-brand)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.09)]"
      >
        {/* Image */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)] p-6 min-h-[200px]">
          <span className="absolute top-3.5 left-3.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-muted)]">
            {machine.tier}
          </span>
          <Image
            src={machine.heroImage.src}
            alt={machine.heroImage.alt}
            width={360}
            height={360}
            className="max-h-[170px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 80vw, 22vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight">
              {machine.name}
            </h3>
            <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
              {machine.blurb}
            </p>
          </div>

          <StatRow stats={machine.stats.slice(0, 4)} />

          <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-brand)]">
            View details
            <ArrowUpRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
