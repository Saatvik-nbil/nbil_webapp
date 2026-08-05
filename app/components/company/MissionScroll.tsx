"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "We advance the field of biofabrication with technologies that open new frontiers in research and medicine, bridging the gap between experimental work and the clinic.";

/* One continuous stroke spanning the full width, sitting below the copy: in at
   the left edge, once around the target, then out at the right edge. The band
   is its own row under the text, so it can't run into the words. */
const MISSION_STROKE = [
  "M 0 170",
  "C 90 170, 190 166, 246 160",
  "C 268 157, 286 156, 300 154",
  // once around the ring, from the bottom of the circle back to the bottom
  "A 58 58 0 1 1 300 38",
  "A 58 58 0 1 1 300 154",
  // and away to the right edge
  "C 330 156, 366 162, 430 166",
  "C 720 178, 1120 172, 1440 164",
].join(" ");

/* Concentric ring + centre mark, so it reads as a target. */
const TARGET_DETAIL = [
  "M 300 126 A 30 30 0 1 1 300 66 A 30 30 0 1 1 300 126",
  "M 300 104 A 8 8 0 1 1 300 88 A 8 8 0 1 1 300 104",
];

export default function MissionScroll() {
  const root = useRef<HTMLDivElement>(null);
  const mainPath = useRef<SVGPathElement>(null);
  const detailA = useRef<SVGPathElement>(null);
  const detailB = useRef<SVGPathElement>(null);
  const words = STATEMENT.split(" ");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = [mainPath.current, detailA.current, detailB.current].filter(
      (p): p is SVGPathElement => Boolean(p),
    );

    if (reduced) {
      gsap.set(".mission-word", { opacity: 1 });
      paths.forEach((p) => gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 }));
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

      // Dash offset runs L -> 0 -> -L: the stroke draws itself in from the left,
      // then the tail keeps travelling right until it has left the frame.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      paths.forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const at = i === 0 ? 0 : 0.34 + i * 0.05;
        const span = i === 0 ? 1 : 0.5;
        tl.fromTo(
          path,
          { strokeDashoffset: len },
          { strokeDashoffset: -len, ease: "none", duration: span },
          at,
        );
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
            <span
              key={i}
              className="mission-word inline-block opacity-[0.16] text-[var(--color-dark-ink)] mr-[0.25em]"
            >
              {w}
            </span>
          ))}
        </p>
      </div>

      {/* Full-bleed band under the copy — edge to edge, never over the words. */}
      <div aria-hidden="true" className="relative mt-10 w-full lg:mt-14">
        <svg
          viewBox="0 0 1440 200"
          className="block h-auto w-full"
          fill="none"
          stroke="var(--color-dark-brand, #2d81e4)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path ref={mainPath} strokeWidth="2.25" d={MISSION_STROKE} opacity="0.85" />
          <path ref={detailA} strokeWidth="1.5" d={TARGET_DETAIL[0]} opacity="0.5" />
          <path ref={detailB} strokeWidth="1.5" d={TARGET_DETAIL[1]} opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}
