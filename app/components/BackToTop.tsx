"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowUp } from "@phosphor-icons/react";

const SHOW_AFTER = 480;

/**
 * Floating scroll-to-top button, bottom-right. Appears once the visitor has
 * scrolled roughly a viewport's worth down. Scrolls via the global Lenis
 * instance (see SmoothScroll.tsx) so it glides with the same momentum as
 * anchor links; Lenis never mounts under prefers-reduced-motion, so the
 * fallback there is an instant native jump rather than a smooth one.
 *
 * Tracks scroll position via Motion's useScroll rather than a raw
 * `window.addEventListener("scroll")` — DESIGN.md's anti-pattern list
 * bans the latter in favour of this.
 */
export default function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > SHOW_AFTER);
  });

  function scrollToTop() {
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number, opts?: Record<string, unknown>) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={reduce ? false : { opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          // bottom-[9rem] clears both MobileStickyCTA and the NBILBot
          // launcher on phones; sm:bottom-[5.75rem] clears just the launcher
          // above sm, where MobileStickyCTA is hidden. See NBILBot.tsx for
          // the launcher's own offsets — keep these in sync with it.
          className="fixed right-5 bottom-[9rem] z-40 flex size-11 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[0_10px_30px_rgba(2,12,27,0.14)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)] sm:right-8 sm:bottom-[5.75rem]"
        >
          <ArrowUp size={18} weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
