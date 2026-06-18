"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CatalogHero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: EASE },
        };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24"
    >
      {/* Ambient teal wash, very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-surface), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left — copy (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            <motion.p
              {...rise(0)}
              className="text-[13px] font-semibold tracking-tight text-[var(--color-brand)]"
            >
              The full Trivima range, by Next Big Innovation Labs
            </motion.p>

            <motion.h1
              id="hero-heading"
              {...rise(0.06)}
              className="text-[2.75rem] sm:text-[3.25rem] lg:text-[4rem] font-display font-semibold tracking-[-0.03em] leading-[1.04] text-[var(--color-ink)]"
            >
              Bioprinters built to match the geometry of biology.
            </motion.h1>

            <motion.p
              {...rise(0.13)}
              className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[54ch]"
            >
              From a 5.7 kg benchtop starter to a six-extruder research flagship and a
              non-planar rotary system, the Trivima family spans extrusion, inkjet,
              pellet and light-based bioprinting. Explore every machine, spec for spec.
            </motion.p>

            <motion.div {...rise(0.2)} className="flex flex-wrap items-center gap-3">
              <Button asChild className="h-11 px-6 rounded-xl text-[15px]">
                <Link href="#models">
                  Explore the models
                  <ArrowDown data-icon="inline-end" weight="bold" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 px-6 rounded-xl text-[15px]">
                <Link href="#compare">Compare specs</Link>
              </Button>
            </motion.div>

            {/* Key facts, stated as a line rather than a metric grid */}
            <motion.p
              {...rise(0.28)}
              className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-hairline)] pt-7 text-[14px] text-[var(--color-ink-muted)]"
            >
              <span><strong className="font-semibold text-[var(--color-ink)]">Six models</strong></span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">·</span>
              <span>extrusion, inkjet, pellet and light</span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">·</span>
              <span>down to <strong className="font-semibold text-[var(--color-ink)]">10&nbsp;µm</strong></span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">·</span>
              <span>eight years in research labs</span>
            </motion.p>
          </div>

          {/* Right — hero machine (5 cols) */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: 0.15, duration: 0.8, ease: EASE },
                })}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl border border-[var(--color-hairline)] bg-gradient-to-b from-[var(--color-surface-raised)] to-[var(--color-surface)] p-6 sm:p-8">
              <Image
                src="/images/np-side.png"
                alt="Trivima NP non-planar bioprinter"
                width={900}
                height={900}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(15,23,42,0.18)]"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
              <Link
                href="/machines/trivima-np"
                className="group absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex items-center justify-between rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)]/85 backdrop-blur-sm px-4 py-3 transition-colors hover:border-[var(--color-brand)]"
              >
                <span className="flex flex-col">
                  <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-brand)]">
                    Newest · 2025
                  </span>
                  <span className="text-[14px] font-medium text-[var(--color-ink)]">
                    Trivima NP — non-planar
                  </span>
                </span>
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="text-[var(--color-ink-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-brand)]"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
