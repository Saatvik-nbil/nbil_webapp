"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global smooth-scroll provider (animejs.com-style momentum scrolling).
 * Lenis interpolates the native scroll, and we drive GSAP's ticker from it so
 * every ScrollTrigger (e.g. the HeroScrub pass-through) stays perfectly in sync.
 * Disabled entirely under prefers-reduced-motion — native scroll, no smoothing.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Expose for programmatic scrolling (anchor links, debugging).
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Keep ScrollTrigger updated from Lenis' scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (single rAF loop, no lag smoothing).
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
