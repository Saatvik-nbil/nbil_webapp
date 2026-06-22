"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { machines } from "@/lib/machines";

const EASE = [0.16, 1, 0.3, 1] as const;
const ORDER = ["trivima-np", "trivima-aura", "trivima-pro"];

export default function ProductsShowcase() {
  const reduce = useReducedMotion();
  const items = ORDER.map((s) => machines.find((m) => m.slug === s)!).filter(Boolean);

  return (
    <section id="products" aria-labelledby="products-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              The product
            </p>
            <h2
              id="products-heading"
              className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              Trivima: one bioprinter family, three ways to build
            </h2>
            <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
              A non-planar rotary system, a six-extruder flagship and a light-based platform,
              every machine shares one workflow.
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 px-5 rounded-xl text-[14px] shrink-0 self-start lg:self-auto">
            <Link href="/trivima">
              Compare the full range
              <ArrowRight data-icon="inline-end" weight="bold" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((m, i) => (
            <motion.div
              key={m.slug}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 3) * 0.07, duration: 0.55, ease: EASE }}
            >
              <Link
                href={`/machines/${m.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] transition-all duration-300 hover:border-[var(--color-brand)] hover:shadow-[0_16px_44px_rgba(15,23,42,0.10)]"
              >
                <div className="relative flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)] p-6 min-h-[190px]">
                  <span className="absolute top-3.5 left-3.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-muted)]">
                    {m.tier}
                  </span>
                  <Image
                    src={m.heroImage.src}
                    alt={m.heroImage.alt}
                    width={360}
                    height={360}
                    className="max-h-[160px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 80vw, 22vw"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight">
                    {m.name}
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                    {m.blurb}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-medium text-[var(--color-brand-strong)]">
                    View details
                    <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
