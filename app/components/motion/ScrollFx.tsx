"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Scroll-linked motion shared by the inner pages (machine, blog, article), so
 * they move the way the home page does rather than only fading in.
 *
 * Every piece renders a plain, static element under prefers-reduced-motion.
 * Lenis scrolls the window natively, so Motion's useScroll tracks it as is.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* RiseIn: on-load entrance for hero copy (not scroll-triggered, since */
/* a hero is already on screen when the page opens).                   */
/* ------------------------------------------------------------------ */

export function RiseIn({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Heading whose lines slide up out of a mask, like the home hero. */
export function MaskedTitle({
  text,
  className,
  id,
  delay = 0.05,
}: {
  text: string;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <h1 id={id} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: delay + i * 0.06, duration: 0.85, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax: drifts its content against the scroll while the element   */
/* crosses the viewport. Optional scale and fade for "zoom" reveals.   */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  className,
  y = [60, -60],
  scale,
  opacity,
  offset = ["start end", "end start"],
}: {
  children: ReactNode;
  className?: string;
  /** px at the start and end of the range. */
  y?: [number, number];
  scale?: [number, number];
  opacity?: [number, number];
  offset?: [string, string];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Motion's offset type is a template-literal union; these are valid pairs.
    offset: offset as never,
  });
  const ty = useTransform(scrollYProgress, [0, 1], y);
  const sc = useTransform(scrollYProgress, [0, 1], scale ?? [1, 1]);
  const op = useTransform(scrollYProgress, [0, 1], opacity ?? [1, 1]);

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: ty, scale: sc, opacity: op, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hero exit: as the page scrolls away from the top, the hero copy lifts and
 * fades and the backdrop drifts slower than the page.
 */
export function HeroExit({
  children,
  className,
  distance = 140,
  fadeTo = 0.15,
  over = 700,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  fadeTo?: number;
  /** px of page scroll the exit plays over, measured from the top. Heroes
   *  sit at the top of the page, so the window's scroll is the right clock. */
  over?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, over], [0, -distance]);
  const opacity = useTransform(scrollY, [0, over], [1, fadeTo]);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}

/**
 * Full-bleed hero backdrop that moves at a fraction of the scroll speed, so
 * the photo stays behind while the copy scrolls over it. Fills its
 * positioned parent; overscaled slightly so the drift never shows an edge.
 */
export function BackdropDrift({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 280]);
  const scale = useTransform(scrollY, [0, 1000], [1.06, 1.16]);
  if (reduce) return <div className="absolute inset-0">{children}</div>;
  return (
    <motion.div className="absolute inset-0" style={{ y, scale, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollZoom: an image that starts slightly inset and zoomed, and     */
/* opens out to full size as it scrolls into place.                    */
/* ------------------------------------------------------------------ */

export function ScrollZoom({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const innerScale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.3, 1]);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      <motion.div style={{ scale: innerScale }} className="h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrubText: words light up one by one as the paragraph is scrolled,  */
/* the same reading effect as the home page's mission statement.       */
/* ------------------------------------------------------------------ */

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export function ScrubText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  if (reduce) return <p className={className}>{text}</p>;
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {w + (i < words.length - 1 ? " " : "")}
        </Word>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger: children rise in one after another when the group enters.  */
/* ------------------------------------------------------------------ */

const groupVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={groupVariants}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollLine: a hairline that draws itself across as it is scrolled.  */
/* ------------------------------------------------------------------ */

export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 40%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      <motion.div
        className="h-px w-full origin-left bg-[var(--color-brand)]"
        style={{ scaleX: reduce ? 1 : scaleX }}
      />
    </div>
  );
}
