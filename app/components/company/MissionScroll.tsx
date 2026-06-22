"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "We advance the field of biofabrication with technologies that open new frontiers in research and medicine, bridging the gap between experimental work and the clinic.";

export default function MissionScroll() {
  const root = useRef<HTMLDivElement>(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".mission-word", { opacity: 1 });
      return;
    }
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      gsap.to(q(".mission-word"), {
        opacity: 1,
        stagger: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="mission-heading"
      className="relative bg-[var(--color-dark-bg)] py-28 lg:py-40 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, #1c3a63, transparent)" }}
      />
      <div className="relative max-w-5xl mx-auto px-6">
        <p
          id="mission-heading"
          className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--color-dark-brand)] mb-8"
        >
          Our mission
        </p>
        <p className="font-display font-semibold tracking-[-0.02em] leading-[1.22] text-[1.9rem] sm:text-[2.6rem] lg:text-[3.1rem] max-w-[20ch] sm:max-w-[24ch]">
          {words.map((w, i) => (
            <span key={i} className="mission-word inline-block opacity-[0.16] text-[var(--color-dark-ink)] mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
