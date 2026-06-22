"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * ─── 3D MODEL INTEGRATION POINT ────────────────────────────────────────────
 *
 * The hero right column shows a 3D interactive model that gently follows
 * your cursor. To use your own GLB or STL file:
 *
 *   STEP 1 — Add the file:
 *     Put your .glb file at:  /public/models/your-machine.glb
 *     (Create the /public/models/ directory if it doesn't exist)
 *
 *   STEP 2 — Change the MODEL_SRC constant below:
 *     const MODEL_SRC = "/models/your-machine.glb";   ← change this line
 *
 *   STEP 3 — (Optional) Tune appearance in CatalogHero:
 *     <ModelViewer
 *       src={MODEL_SRC}
 *       scale={2}          ← increase/decrease overall size
 *       position={[0,0,0]} ← shift model in world space [x,y,z]
 *       rotation={[0,0,0]} ← initial rotation in radians [x,y,z]
 *     />
 *
 *   STEP 4 — For STL files pass  fileType="stl"  as well.
 *
 * ─── END INTEGRATION POINT ─────────────────────────────────────────────────
 */
const MODEL_SRC = undefined; // ← Replace with "/models/your-machine.glb"

// Dynamically import so Three.js never runs on the server
const ModelViewer = dynamic(() => import("@/components/ui/model-viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="size-12 rounded-full"
        style={{
          border: "2px solid rgba(109,40,217,0.15)",
          borderTopColor: "var(--color-brand)",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

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
      className="relative overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-20 min-h-[90vh] flex items-center"
    >
      {/* ── Ambient glow blobs ───────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-8%] h-[600px] w-[600px] rounded-full opacity-50 blur-[100px]"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-surface), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-5%] h-[400px] w-[400px] rounded-full opacity-30 blur-[80px]"
        style={{ background: "radial-gradient(closest-side, #c4b8ff, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">

          {/* ── Left: copy (6 cols) ─────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-7">
            <motion.p {...rise(0)} className="text-[13px] font-semibold tracking-tight text-[var(--color-brand)]">
              The full Trivima range, by Next Big Innovation Labs
            </motion.p>

            <motion.h1
              id="hero-heading"
              {...rise(0.06)}
              className="text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] font-display font-semibold tracking-[-0.03em] leading-[1.04] text-[var(--color-ink)]"
            >
              Bioprinters built to match the geometry of biology.
            </motion.h1>

            <motion.p
              {...rise(0.13)}
              className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[50ch]"
            >
              A non-planar rotary system and a light-based MSLA platform — the
              Trivima family spans the geometry and technology your research
              demands. Explore every machine, spec for spec.
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

            <motion.p
              {...rise(0.28)}
              className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-hairline)] pt-6 text-[13.5px] text-[var(--color-ink-muted)]"
            >
              <span><strong className="font-semibold text-[var(--color-ink)]">Two systems</strong></span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">·</span>
              <span>non-planar rotary &amp; MSLA light-based</span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">·</span>
              <span>down to <strong className="font-semibold text-[var(--color-ink)]">10&nbsp;µm</strong></span>
              <span aria-hidden="true" className="text-[var(--color-ink-faint)]">·</span>
              <span>eight years in research labs</span>
            </motion.p>
          </div>

          {/* ── Right: 3D model card (6 cols) ───────────────────── */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.94 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: 0.18, duration: 0.9, ease: EASE },
                })}
            className="lg:col-span-6 relative"
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                height: "clamp(420px, 52vw, 620px)",
                background:
                  "linear-gradient(145deg, rgba(240,236,255,0.65) 0%, rgba(248,247,255,0.45) 100%)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(109,40,217,0.14)",
                boxShadow: [
                  "inset 0 1.5px 0 rgba(255,255,255,0.80)",
                  "inset 0 -1px 0 rgba(109,40,217,0.08)",
                  "0 0 0 1px rgba(109,40,217,0.07)",
                  "0 24px 64px rgba(17,8,32,0.10)",
                  "0 8px 24px rgba(109,40,217,0.08)",
                ].join(", "),
              }}
            >
              {/* Top gloss streak */}
              <span
                className="pointer-events-none absolute inset-x-[8%] top-0 h-px rounded-full z-10"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.90) 70%, transparent)",
                }}
                aria-hidden="true"
              />

              {/* ── 3D MODEL VIEWER ─────────────────────────────────
                  Change MODEL_SRC at the top of this file to swap
                  in your own GLB/STL.  See the comment block above.
                  ─────────────────────────────────────────────────── */}
              <ModelViewer
                src={MODEL_SRC}
                scale={2}
                position={[0, -0.1, 0]}
                rotation={[0, Math.PI * 0.1, 0]}
              />

              {/* Label pill */}
              <div className="absolute bottom-5 left-5 right-5 z-10">
                <Link
                  href="/machines/trivima-np"
                  className="group flex items-center justify-between w-full rounded-xl border border-[var(--color-hairline)] px-4 py-3 transition-all duration-200 hover:border-[var(--color-brand)]"
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 16px rgba(17,8,32,0.06)",
                  }}
                >
                  <span className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-brand)]">
                      Interactive 3D · Move your cursor
                    </span>
                    <span className="text-[14px] font-medium text-[var(--color-ink)]">
                      Trivima NP — non-planar bioprinter
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    className="shrink-0 text-[var(--color-ink-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-brand)]"
                  />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
