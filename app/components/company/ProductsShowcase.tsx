"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";
import { machines, type Machine } from "@/lib/machines";

const EASE = [0.16, 1, 0.3, 1] as const;
const ORDER = ["trivima-np", "trivima-aura", "trivima-pro"];
// Softer than the FocusAreas tilt it's modelled on: these cards are small, so
// the same angles would read as a wobble rather than a nudge.
const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.4 } as const;

/**
 * One product card. Split out of the map because the pointer tilt needs its own
 * motion values per card, and hooks can't run inside a loop.
 */
function ProductCard({ machine: m, index }: { machine: Machine; index: number }) {
  const reduce = useReducedMotion();

  // Cursor position over the image well, mapped to a rotation and a lift.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hovered = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), TILT_SPRING);
  const z = useSpring(useTransform(hovered, [0, 1], [0, 40]), TILT_SPRING);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    hovered.set(1);
  };
  const resetTilt = () => {
    px.set(0);
    py.set(0);
    hovered.set(0);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 3) * 0.07, duration: 0.55, ease: EASE }}
    >
      <Link
        href={`/machines/${m.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] transition-all duration-300 hover:border-[var(--color-brand)] hover:shadow-[0_16px_44px_rgba(15,23,42,0.10)]"
      >
        <div
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          className="relative flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)] p-6 min-h-[190px] [perspective:900px]"
        >
          <span className="absolute top-3.5 left-3.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-ink-muted)]">
            {m.tier}
          </span>
          <motion.div
            style={reduce ? undefined : { rotateX, rotateY, z }}
            className="[transform-style:preserve-3d] will-change-transform"
          >
            <Image
              src={m.heroImage.src}
              alt={m.heroImage.alt}
              width={360}
              height={360}
              className="max-h-[160px] w-auto object-contain"
              sizes="(max-width: 768px) 80vw, 22vw"
            />
          </motion.div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight">
            {m.name}
          </h3>
          <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">{m.blurb}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-medium text-[var(--color-brand-strong)]">
            View details
            <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductsShowcase() {
  const items = ORDER.map((s) => machines.find((m) => m.slug === s)!).filter(Boolean);

  return (
    <section id="products" aria-labelledby="products-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2
              id="products-heading"
              className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              Trivima: one bioprinter family, three ways to build
            </h2>
            <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
              A non-planar rotary bioprinter, a six-extruder flagship and a light-based
              bioprinter. Every Trivima shares one bioprinting workflow.
            </p>
          </div>
          <OriginButton
            href="/trivima"
            variant="outline"
            className="h-11 px-5 text-[14px] shrink-0 self-start lg:self-auto"
          >
            Compare the full range
            <ArrowRight size={15} weight="bold" />
          </OriginButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((m, i) => (
            <ProductCard key={m.slug} machine={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
