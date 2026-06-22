"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LiquidGlass } from "@/components/ui/liquid-glass";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = ["We", "set", "out", "to", "print", "a", "better", "future."];

export default function CompanyHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;

      // Entrance: words rise from behind a mask, supporting copy follows.
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(q(".hero-word"), {
          yPercent: 120,
          duration: 0.9,
          stagger: 0.06,
        })
        .from(q(".hero-fade"), { y: 18, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.5")
        .from(
          q(".hero-visual"),
          { scale: 0.94, opacity: 0, duration: 1.0, ease: "power2.out" },
          "-=0.9",
        );

      // Scroll parallax: visual and floating accents drift at different rates.
      gsap.to(q(".hero-visual"), {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".float-a"), {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".float-b"), {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      // Copy fades as the hero leaves.
      gsap.to(q(".hero-copy"), {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "center top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="company-hero-heading"
      className="relative min-h-[100dvh] overflow-hidden flex items-center pt-28 pb-20"
    >
      {/* Background field: faint grid + drifting blue accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hairline-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--color-hairline-subtle) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 70% 30%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 70% 30%, black, transparent 75%)",
          }}
        />
        <div
          className="float-a absolute -top-24 right-[6%] h-[420px] w-[420px] rounded-full blur-3xl opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--color-brand-surface), transparent)" }}
        />
        <div
          className="float-b absolute bottom-[-10%] left-[-6%] h-[360px] w-[360px] rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(closest-side, #dcebfb, transparent)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Copy — left, 7 cols */}
          <div className="hero-copy lg:col-span-7 flex flex-col gap-7">
            <p className="hero-fade inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              Next Big Innovation Labs
              <span aria-hidden className="h-px w-8 bg-[var(--color-brand)]" />
              Bengaluru, India
            </p>

            <h1
              id="company-hero-heading"
              className="font-display font-semibold tracking-[-0.03em] leading-[1.02] text-[var(--color-ink)] text-[2.85rem] sm:text-[3.6rem] lg:text-[4.5rem]"
            >
              <span className="sr-only">We set out to print a better future.</span>
              <span aria-hidden="true" className="flex flex-wrap gap-x-[0.28em]">
                {HEADLINE.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden py-[0.02em]">
                    <span
                      className={`hero-word inline-block ${
                        w === "future." ? "text-[var(--color-brand)]" : ""
                      }`}
                    >
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            <p className="hero-fade text-[1.0625rem] lg:text-[1.15rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[52ch]">
              Since 2016, NBIL has built the bioprinting instruments researchers and
              clinicians rely on to model disease, develop drugs, and engineer living
              tissue. One mission, printed one layer at a time.
            </p>

            <div className="hero-fade flex flex-wrap items-center gap-3">
              <Button asChild className="h-12 px-6 rounded-xl text-[15px]">
                <Link href="/trivima">
                  Explore the bioprinters
                  <ArrowRight data-icon="inline-end" weight="bold" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-6 rounded-xl text-[15px]">
                <Link href="#connect">Partner with us</Link>
              </Button>
            </div>

            <p className="hero-fade flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-hairline)] pt-6 text-[13.5px] text-[var(--color-ink-muted)]">
              <span className="font-semibold text-[var(--color-ink)]">
                World Economic Forum Technology Pioneer
              </span>
              <span aria-hidden className="text-[var(--color-ink-faint)]">·</span>
              <span>600+ researchers trained</span>
              <span aria-hidden className="text-[var(--color-ink-faint)]">·</span>
              <span>3 bioprinting patents</span>
            </p>
          </div>

          {/* Visual — right, 5 cols */}
          <div className="hero-visual lg:col-span-5 relative">
            <div className="relative rounded-[2rem] border border-[var(--color-hairline)] bg-gradient-to-b from-[var(--color-surface-raised)] to-[var(--color-surface)] p-6 sm:p-8">
              <Image
                src="/images/np-side.png"
                alt="A Trivima bioprinter by Next Big Innovation Labs"
                width={900}
                height={900}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_28px_56px_rgba(15,23,42,0.16)]"
                sizes="(max-width: 1024px) 80vw, 38vw"
              />
              <LiquidGlass
                tint="light"
                className="absolute left-7 bottom-7 right-7 rounded-xl border border-white/50"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[13px] font-medium text-[var(--color-ink)]">
                    The Trivima bioprinter line
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-brand-strong)]">
                    3 models
                  </span>
                </div>
              </LiquidGlass>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-fade absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[var(--color-ink-faint)]">
        <span className="text-[11px] font-mono uppercase tracking-[0.16em]">Scroll</span>
        <ArrowDown size={16} weight="bold" className="animate-bounce" />
      </div>
    </section>
  );
}
