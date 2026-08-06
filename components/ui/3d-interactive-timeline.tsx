"use client";

/**
 * Timeline3D — alternating vertical timeline with a subtle pointer-driven 3D
 * tilt on each card, joined by a scroll-drawn connector that bows through the
 * empty half of the layout and points an arrow at the card you are reading.
 *
 * Adapted from the upstream `3d-interactive-timeline` component for this
 * codebase:
 *  - uses `motion/react` (already a dependency) instead of `framer-motion`
 *    and `react-intersection-observer`;
 *  - the per-event reveal lives in its own child component so `useInView`
 *    isn't called inside a `.map()` (rules of hooks);
 *  - colours come from the `globals.css` design tokens rather than hard-coded
 *    slate/indigo, so it sits on the light canvas like the rest of the site;
 *  - descriptions stay visible instead of hiding behind hover, which keeps the
 *    content readable on touch and to screen readers;
 *  - all motion is disabled under `prefers-reduced-motion`.
 */

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  buildConnectorPath,
  sampleConnector,
  type NodeBox,
} from "./timeline-connector-geometry";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  /** "contain" for logos and posters, "cover" (default) for photographs. */
  imageFit?: "cover" | "contain";
  category?: string;
  link?: {
    url: string;
    text: string;
  };
}

export interface Timeline3DProps {
  events: TimelineEvent[];
  /** Renders the image frame at all; individual events may still omit `image`. */
  showImages?: boolean;
  /** Accessible name for the list, e.g. "Company milestones". */
  ariaLabel?: string;
  className?: string;
}

/** Half the width of a node, used to sit it exactly on the rail. */
const RAIL_LEFT = "left-[1.125rem]";

/** #2d81e4 — --color-brand, spelled out where a filter needs an alpha. */
const BRAND_RGB = "45, 129, 228";

/* -------------------------------------------------------------------------
 * Connector
 * ---------------------------------------------------------------------- */

function TimelineConnector({
  nodes,
  width,
  height,
  progress,
  reduced,
}: {
  nodes: NodeBox[];
  width: number;
  height: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const probeRef = React.useRef<SVGPathElement>(null);
  const tipRef = React.useRef<SVGGElement>(null);
  // Held in a ref, not state: a frame must never wait on a React render.
  const samplerRef = React.useRef<ReturnType<typeof sampleConnector> | null>(null);

  const d = React.useMemo(
    () => buildConnectorPath(nodes, width),
    [nodes, width]
  );

  const drawn = useMotionValue(0);

  const apply = React.useCallback(
    (v: number) => {
      const sampler = samplerRef.current;
      const tip = tipRef.current;

      if (!sampler || height <= 0) {
        drawn.set(v);
        return;
      }

      // `v` spans the whole list, so `v * height` is the y currently sitting on
      // the scroll line. Hand the sampler that absolute y rather than `v` — the
      // path is a card shorter than the list, and conflating the two makes the
      // arrow drift upward by a card's height by the end.
      const s = sampler(v * height);
      drawn.set(s.lengthFraction);

      if (tip && !reduced) {
        // One attribute write per frame — no path measurement, no React render.
        tip.setAttribute(
          "transform",
          `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.angle.toFixed(1)})`
        );
        tip.style.opacity = v > 0.001 && v < 0.999 ? "1" : "0";
      }
    },
    [drawn, reduced, height]
  );

  // Re-sample whenever the path changes: filtering the list or a late-loading
  // image both reshape it. Re-apply immediately, since the path can change
  // shape without the scroll position moving at all.
  React.useEffect(() => {
    samplerRef.current =
      d && probeRef.current ? sampleConnector(probeRef.current) : null;
    apply(progress.get());
  }, [d, apply, progress]);

  useMotionValueEvent(progress, "change", apply);

  if (!d) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      {/* Geometry probe — never painted, used for length/point lookups. */}
      <path ref={probeRef} d={d} stroke="none" fill="none" />

      {/* Unvisited track */}
      <path
        d={d}
        stroke="var(--color-hairline)"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Drawn-so-far ribbon */}
      <motion.path
        d={d}
        stroke="var(--color-brand)"
        strokeWidth={2.25}
        strokeLinecap="round"
        fill="none"
        style={{
          pathLength: reduced ? 1 : drawn,
          filter: `drop-shadow(0 0 7px rgba(${BRAND_RGB}, 0.35))`,
        }}
      />

      {!reduced && (
        <g ref={tipRef} style={{ opacity: 0 }}>
          <circle r={11} fill={`rgba(${BRAND_RGB}, 0.14)`} />
          <circle r={5.5} fill="var(--color-canvas)" />
          <path d="M -3.2 -4.2 L 5 0 L -3.2 4.2 Z" fill="var(--color-brand)" />
        </g>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * Card
 * ---------------------------------------------------------------------- */

/**
 * Memoised: the parent re-renders whenever the measured layout changes, and
 * without this every card reconciles along with it.
 */
const TimelineCard = React.memo(function TimelineCard({
  event,
  index,
  total,
  showImages,
  reduced,
  registerItem,
}: {
  event: TimelineEvent;
  index: number;
  total: number;
  showImages: boolean;
  reduced: boolean;
  registerItem: (index: number, el: HTMLLIElement | null) => void;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const [hovered, setHovered] = React.useState(false);

  const setRef = React.useCallback(
    (el: HTMLLIElement | null) => {
      ref.current = el;
      registerItem(index, el);
    },
    [index, registerItem]
  );

  // Even entries hang on the left of the rail, odd entries on the right.
  const isLeft = index % 2 === 0;
  const active = hovered;

  return (
    <li
      ref={setRef}
      className={cn(
        // The bottom margin lives on the <li> so the connector, which spans the
        // full <ol>, stops level with the last card instead of dangling.
        "relative mb-12 pl-14 last:mb-0 lg:mb-16 lg:w-1/2 lg:pl-0",
        isLeft ? "lg:mr-auto lg:pr-14" : "lg:ml-auto lg:pl-14"
      )}
    >
      {/* Node on the rail */}
      <span
        data-timeline-node
        aria-hidden="true"
        className={cn(
          "absolute top-7 z-20 -translate-x-1/2",
          RAIL_LEFT,
          isLeft
            ? "lg:left-auto lg:right-0 lg:translate-x-1/2"
            : "lg:left-0 lg:-translate-x-1/2"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border-4 border-[var(--color-canvas)] bg-[var(--color-brand)] font-mono text-[11px] font-medium text-white transition-shadow duration-300",
            active
              ? "shadow-[0_0_0_6px_var(--color-brand-surface)]"
              : "shadow-[0_0_0_0_var(--color-brand-surface)]"
          )}
        >
          {event.icon ?? String(index + 1).padStart(2, "0")}
        </span>
      </span>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24, x: isLeft ? -24 : 24 }}
        animate={inView ? { opacity: 1, y: 0, x: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Tilt layer — pointer parallax only, so the card below is free to
            use its own transform for the hover lift. The rotation is derived
            in CSS from --tilt-x / --tilt-y on the timeline root, so pointer
            movement never touches React. */}
        <div
          className={reduced ? undefined : "transition-transform duration-150 ease-out"}
          style={
            reduced
              ? undefined
              : ({
                  "--tilt-dir": isLeft ? "-1" : "1",
                  transform:
                    "perspective(1200px) rotateY(calc(var(--tilt-x, 0) * var(--tilt-dir, 1) * 3deg)) rotateX(calc(var(--tilt-y, 0) * -3deg))",
                } as React.CSSProperties)
          }
        >
          <article
            data-timeline-card
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_1px_2px_rgba(2,12,27,0.04)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_38px_-16px_rgba(2,12,27,0.28)]"
          >
            {showImages && (
              <div
                className={cn(
                  "relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-surface-raised)]",
                  event.image ? "" : "border-dashed"
                )}
              >
                {event.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className={cn(
                      "h-full w-full transition-transform duration-700 ease-out",
                      event.imageFit === "contain"
                        ? "object-contain p-6"
                        : "object-cover group-hover:scale-[1.04]"
                    )}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[var(--color-ink-faint)]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                      Photo
                    </span>
                    <span className="text-[11px]">coming soon</span>
                  </div>
                )}

                {event.category && (
                  <span className="absolute right-3 top-3 rounded-full bg-[var(--color-brand-surface)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-brand-strong)]">
                    {event.category}
                  </span>
                )}
              </div>
            )}

            <div className="p-6 lg:p-7">
              <div className="mb-3 flex items-baseline gap-3">
                <span className="font-mono text-[1.75rem] font-medium leading-none tracking-tight text-[var(--color-brand)]">
                  {event.date}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {event.title}
              </h3>

              <p className="mt-2 max-w-none text-[14.5px] leading-relaxed text-[var(--color-ink-muted)]">
                {event.description}
              </p>

              {event.link && (
                <a
                  href={event.link.url}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg text-[13.5px] font-medium text-[var(--color-brand-strong)] underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
                >
                  {event.link.text}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>

            {/* Accent bar sweeps in on hover */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-[var(--color-brand)] transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </article>
        </div>
      </motion.div>
    </li>
  );
});

/* -------------------------------------------------------------------------
 * Timeline
 * ---------------------------------------------------------------------- */

export function Timeline3D({
  events,
  showImages = true,
  ariaLabel = "Timeline",
  className,
}: Timeline3DProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLOListElement>(null);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  const [layout, setLayout] = React.useState<{
    nodes: NodeBox[];
    width: number;
    height: number;
  }>({ nodes: [], width: 0, height: 0 });

  const reduced = useReducedMotion() ?? false;

  const registerItem = React.useCallback(
    (index: number, el: HTMLLIElement | null) => {
      itemRefs.current[index] = el;
    },
    []
  );

  /* --- Measure node + card boxes so the connector can avoid them --------- */
  const measure = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const listRect = list.getBoundingClientRect();
    const nodes: NodeBox[] = [];

    for (let i = 0; i < events.length; i++) {
      const li = itemRefs.current[i];
      if (!li) continue;
      const nodeEl = li.querySelector<HTMLElement>("[data-timeline-node]");
      const cardEl = li.querySelector<HTMLElement>("[data-timeline-card]");
      if (!nodeEl || !cardEl) continue;

      const n = nodeEl.getBoundingClientRect();
      const c = cardEl.getBoundingClientRect();

      nodes.push({
        x: n.left - listRect.left + n.width / 2,
        y: n.top - listRect.top + n.height / 2,
        cardLeft: c.left - listRect.left,
        cardRight: c.right - listRect.left,
        cardTop: c.top - listRect.top,
      });
    }

    setLayout((prev) => {
      const same =
        prev.width === listRect.width &&
        prev.height === listRect.height &&
        prev.nodes.length === nodes.length &&
        prev.nodes.every(
          (p, i) => Math.abs(p.y - nodes[i].y) < 0.5 && Math.abs(p.x - nodes[i].x) < 0.5
        );
      return same ? prev : { nodes, width: listRect.width, height: listRect.height };
    });
  }, [events.length]);

  React.useLayoutEffect(() => {
    itemRefs.current.length = events.length;
    measure();

    const list = listRef.current;
    if (!list) return;

    // Catches breakpoint changes, filtering, and cards growing as their
    // images decode.
    const observer = new ResizeObserver(measure);
    observer.observe(list);

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, events.length]);

  /* --- Scroll progress, mapped onto the connector ----------------------- */
  const { scrollYProgress } = useScroll({
    target: listRef,
    // 0 when the list top reaches 62% down the viewport, 1 when its bottom
    // does — so the arrow sits just under the card being read.
    offset: ["start 62%", "end 62%"],
  });

  // Deliberately no spring here. Lenis already lerps the scroll position, so a
  // spring on top is a second smoothing pass over an already-smooth signal —
  // all trailing, no benefit. Raw progress locks the arrow to the scroll.

  /* --- Pointer parallax -------------------------------------------------- */
  React.useEffect(() => {
    if (reduced) return;
    // Pointer parallax is meaningless on touch — skip the listener entirely.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const el = containerRef.current;
    if (!el) return;

    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const onMove = (e: MouseEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        // Written as CSS custom properties rather than React state. State here
        // re-rendered every card on every pointer frame, which was starving the
        // scroll handler; the cards now read these straight from CSS.
        el.style.setProperty(
          "--tilt-x",
          (((clientX - rect.left) / rect.width) * 2 - 1).toFixed(3)
        );
        el.style.setProperty(
          "--tilt-y",
          (((clientY - rect.top) / rect.height) * 2 - 1).toFixed(3)
        );
      });
    };

    // Settle back to flat when the pointer leaves, or the cards stay frozen
    // at whatever angle they had when it crossed the edge.
    const onLeave = () => {
      el.style.setProperty("--tilt-x", "0");
      el.style.setProperty("--tilt-y", "0");
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  if (events.length === 0) {
    return (
      <div className={cn("px-6 py-16 text-center", className)}>
        <p className="mx-auto text-[var(--color-ink-muted)]">
          Nothing to show here yet.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
    >
      {/* Decorative depth — soft brand-tinted orbs drifting behind the rail. */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[var(--color-brand)] opacity-[0.07]"
              style={{
                width: `${140 + i * 60}px`,
                height: `${140 + i * 60}px`,
                filter: "blur(38px)",
              }}
              animate={{
                x: [`${8 + i * 14}vw`, `${18 + i * 12}vw`, `${8 + i * 14}vw`],
                y: [`${6 + i * 15}vh`, `${16 + i * 13}vh`, `${6 + i * 15}vh`],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 24 + i * 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-6">
        <ol ref={listRef} className="relative" aria-label={ariaLabel}>
          {/* The connector is measured client-side, so it can't be server
              rendered. Until it exists, hold a plain rail in its place. */}
          {layout.nodes.length === 0 && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-0 top-0 z-0 w-px bg-[var(--color-hairline)] lg:left-1/2 lg:-translate-x-1/2",
                RAIL_LEFT
              )}
            />
          )}

          <TimelineConnector
            nodes={layout.nodes}
            width={layout.width}
            height={layout.height}
            progress={scrollYProgress}
            reduced={reduced}
          />

          {events.map((event, i) => (
            <TimelineCard
              key={event.id}
              event={event}
              index={i}
              total={events.length}
              showImages={showImages}
              reduced={reduced}
              registerItem={registerItem}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Timeline3D;
