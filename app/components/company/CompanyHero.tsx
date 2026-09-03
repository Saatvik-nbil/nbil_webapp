"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = ["We", "set", "out", "to", "print", "a", "better", "future."];

/* Card size is solved from the item count, so fewer entries means larger
   cards: 6 is the sweet spot for this column, 8 the practical maximum.
   `pos` sets each shot's focal point: the cards are portrait, so landscape
   sources lose roughly half their width to the crop and need it. */
const HERO_GALLERY: GalleryItem[] = [
  { src: "/images/1.webp", alt: "A bioprinted human ear held on a print disc", pos: "45% 50%" },
  { src: "/images/5.webp", alt: "A printed hydrogel lattice in a petri dish, held in front of a Trivima printer", pos: "70% 50%" },
  { src: "/images/2.jpeg", alt: "A Trivima extruder printing bioink into a petri dish" },
  { src: "/images/3.webp", alt: "The NBIL mark bioprinted inside a clear hydrogel cube", pos: "55% 50%" },
  { src: "/images/6.webp", alt: "Close-up of a Trivima nozzle drawing a single filament", pos: "42% 45%" },
  { src: "/images/7.webp", alt: "A bioprinted human ear on a grey print disc", pos: "50% 48%" },
];

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
      // The clip settles back and lifts slightly as the hero scrolls away,
      // so the print reads as an object being set down rather than a flat panel.
      gsap.fromTo(
        q(".hero-clip"),
        { scale: 1.04, rotateZ: -1.2 },
        {
          scale: 0.96,
          rotateZ: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy: left, 7 cols */}
          <div className="hero-copy lg:col-span-7 flex flex-col gap-7">
            <h1
              id="company-hero-heading"
              className="font-display font-semibold tracking-[-0.03em] leading-[0.94]! text-[var(--color-ink)] text-[2.85rem] sm:text-[3.6rem] lg:text-[4.5rem]"
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
              Since 2016, we have built the bioprinters and bioprinting software
              researchers and clinicians rely on to model disease, develop drugs, and
              engineer living tissue. One mission, bioprinted one layer at a time.
            </p>

            <div className="hero-fade flex flex-wrap items-center gap-3">
              <OriginButton href="/trivima">
                Explore the bioprinters
                <ArrowRight size={16} weight="bold" />
              </OriginButton>
              <OriginButton href="#connect" variant="outline">
                Partner with us
              </OriginButton>
            </div>

            <p className="hero-fade flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-hairline)] pt-6 text-[13.5px] text-[var(--color-ink-muted)]">
              <span className="font-semibold text-[var(--color-ink)]">
                World Economic Forum Technology Pioneer
              </span>
              <span aria-hidden className="text-[var(--color-ink-faint)]">·</span>
              <span>Core bioprinting patents</span>
              <span aria-hidden className="text-[var(--color-ink-faint)]">·</span>
              <span>Bioprinters installed worldwide</span>
            </p>
          </div>

          {/* Visual: right, 5 cols. No panel or frame: the ring sits directly
              on the hero's background field so it reads as part of the scene. */}
          <div className="hero-visual lg:col-span-5 relative">
            {/* Soft pool of light under the ring, so the cards have something
                to sit on without introducing a hard edge. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-60"
              style={{ background: "radial-gradient(closest-side, #dceafb, transparent)" }}
            />
            {/* The ring is wider than its column, so nudge it right: the
                overhang lands in the page margin instead of the copy's gutter.
                Its own div: GSAP owns the transform on .hero-visual and
                .hero-clip, and would overwrite a utility class there.
                `relative` is load-bearing: the light pool above is positioned,
                so without it that glow paints over the ring, positioned
                descendants sit above in-flow ones whatever the DOM order, and
                washes out whichever card is at front. */}
            <div className="relative lg:translate-x-[6%]">
              <CircularGallery items={HERO_GALLERY} className="hero-clip" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
