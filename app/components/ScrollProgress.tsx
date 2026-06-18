"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin top progress bar that tracks how far through the page you've scrolled.
 * Spring-smoothed so it glides with the Lenis momentum rather than snapping.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-[var(--color-brand)] shadow-[0_0_12px_var(--color-brand)]"
    />
  );
}
