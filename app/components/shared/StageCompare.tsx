"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manual three-stage wipe for a full-bleed hero.
 *
 * All three frames are the same subject at the same scale and angle, so this
 * reads as one object moving through the pipeline rather than three pictures
 * side by side. Left to right it follows the order the work actually happens
 * in: the CAD model, then the sliced toolpaths, then the bioprinted part.
 *
 * The divider is a window with real thickness rather than a hairline, and the
 * middle stage is what shows through it. Dragging the window along the frame
 * scrubs the same object through all three states.
 *
 * There is no autoplay. The reveal only moves when the reader moves it, by
 * drag, click, or arrow keys on the handle.
 *
 * The travel is clamped to the stretch of frame the subject actually occupies.
 * Every image puts the subject to the right and leaves the left of the frame
 * as plain background, which is where the hero's copy panel sits: letting the
 * window run under the panel would mean dragging something the reader cannot
 * see. For the same reason the handle drops below the panel on small screens,
 * where the panel is full width.
 */

/** Half the window's width, as a CSS length. Set on the frame as `--band` so
 *  the clip paths, the window chrome and the labels all key off one number. */
const BAND = "var(--band)";

const STEP = 2;

/** Cubic ease-in-out, so the hint accelerates and settles rather than sliding
 *  at a constant speed. */
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export type Stage = {
  src: string;
  alt: string;
  /** Chip pinned to this stage, near the top of the frame. */
  label: string;
};

type Props = {
  /** In pipeline order, left to right. */
  stages: [Stage, Stage, Stage];
  /** Where the window may travel, as a percentage of the frame's width. `max`
   *  has to leave room for the window's own right edge. */
  travel: { min: number; max: number; start: number };
  /** Said beside the handle for anyone who missed the nudge. */
  hint: string;
  /** How far the opening nudge walks either side of its resting place. */
  nudge?: number;
  /** object-position for all three frames. The subject sits off to the right,
   *  so the small-screen crop has to be pushed that way. */
  objectPosition?: string;
};

export default function StageCompare({
  stages,
  travel,
  hint,
  nudge = 10,
  objectPosition = "object-[72%_center] lg:object-center",
}: Props) {
  const { min: MIN, max: MAX, start: START } = travel;
  const [first, middle, last] = stages;

  /** Past this the last stage's label has nowhere to sit without running off
   *  the frame or landing on the window's own label. */
  const LAST_LABEL_MAX = MAX - 6;

  const [pct, setPct] = useState(START);
  const [dragging, setDragging] = useState(false);
  /** Cleared the moment the reader touches the control. */
  const [hinting, setHinting] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  const takeOver = useCallback(() => {
    touched.current = true;
    setHinting(false);
  }, []);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width) return;
      const raw = ((clientX - rect.left) / rect.width) * 100;
      setPct(Math.min(MAX, Math.max(MIN, raw)));
    },
    [MIN, MAX],
  );

  /**
   * First-load hint: the handle walks a little either side of its resting
   * place so the divider reads as something you can move, then returns and
   * stays put. It runs once, and any interaction cancels it mid-flight.
   * Skipped entirely under prefers-reduced-motion, where the copy beside the
   * handle still says what to do.
   */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHinting(false);
      return;
    }

    /** Where the nudge travels, in order, and how long each leg takes. */
    const legs: Array<{ to: number; ms: number }> = [
      { to: Math.min(MAX, START + nudge), ms: 620 },
      { to: Math.max(MIN, START - nudge), ms: 900 },
      { to: START, ms: 620 },
    ];

    let frame = 0;
    let timer = 0;
    let cancelled = false;

    const leg = (index: number, from: number) => {
      if (cancelled || touched.current) return;
      const step = legs[index];
      if (!step) {
        setHinting(false);
        return;
      }
      const begun = performance.now();
      const tick = (now: number) => {
        if (cancelled || touched.current) return;
        const t = Math.min(1, (now - begun) / step.ms);
        setPct(from + (step.to - from) * easeInOut(t));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          leg(index + 1, step.to);
        }
      };
      frame = requestAnimationFrame(tick);
    };

    // A beat after the hero lands, so it is not competing with the copy's
    // own entrance.
    timer = window.setTimeout(() => leg(0, START), 900);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [MIN, MAX, START, nudge]);

  // Tracked on the window so a fast drag that leaves the frame keeps working,
  // and so releasing anywhere ends it.
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    takeOver();
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setPct((v) => Math.max(MIN, v - STEP));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setPct((v) => Math.min(MAX, v + STEP));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(MIN);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(MAX);
    }
  };

  const imageClass = `pointer-events-none absolute inset-0 h-full w-full object-cover ${objectPosition}`;

  return (
    <div
      ref={frameRef}
      className="absolute inset-0 select-none [--band:52px] lg:[--band:78px]"
      onPointerDown={(e) => {
        // Only the bare frame starts a drag: the copy panel above it keeps
        // its own clicks.
        takeOver();
        setDragging(true);
        setFromClientX(e.clientX);
      }}
    >
      {/* Three stages stacked in reverse pipeline order, each one clipped a
          little further left than the one beneath it. What survives is the
          finished print on the right, the middle stage inside the window, and
          the first stage to its left. */}

      {/* Bottom layer: the last stage, filling the frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={last.src} alt={last.alt} draggable={false} className={imageClass} />

      {/* Middle stage, cut off at the window's right edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={middle.src}
        alt={middle.alt}
        draggable={false}
        className={imageClass}
        style={{ clipPath: `inset(0 calc(${100 - pct}% - ${BAND}) 0 0)` }}
      />

      {/* First stage, cut off at the window's left edge. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={first.src}
        alt={first.alt}
        draggable={false}
        className={imageClass}
        style={{ clipPath: `inset(0 calc(${100 - pct}% + ${BAND}) 0 0)` }}
      />

      {/* The window itself: two seams with the middle stage showing between
          them. A dark core keeps each seam readable on the white CAD grid, the
          white edges keep it readable on the blue, and the outer glow lifts it
          off both. The inset ring closes the shape so the pair reads as one
          aperture rather than two unrelated dividers. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
        style={{ left: `${pct}%`, width: `calc(${BAND} * 2)` }}
      >
        <div className="absolute inset-0 ring-1 ring-inset ring-white/25" />
        <div className="absolute inset-y-0 left-0 w-[6px] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_28%,rgba(10,20,34,0.55)_50%,rgba(255,255,255,0.9)_72%,rgba(255,255,255,0)_100%)] shadow-[0_0_18px_rgba(255,255,255,0.6)]" />
        <div className="absolute inset-y-0 right-0 w-[6px] translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_28%,rgba(10,20,34,0.55)_50%,rgba(255,255,255,0.9)_72%,rgba(255,255,255,0)_100%)] shadow-[0_0_18px_rgba(255,255,255,0.6)]" />
      </div>

      {/* Handle */}
      <button
        type="button"
        role="slider"
        aria-label={`Move the window through the ${first.label.toLowerCase()}, the ${middle.label.toLowerCase()} and the ${last.label.toLowerCase()}`}
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`Window over the ${middle.label.toLowerCase()} at ${Math.round(pct)}% across the frame, ${first.label.toLowerCase()} to its left, ${last.label.toLowerCase()} to its right`}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.stopPropagation();
          takeOver();
          setDragging(true);
        }}
        className={`absolute top-[22%] lg:top-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/20 text-white shadow-[0_8px_30px_rgba(2,8,20,0.35)] backdrop-blur-md transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none ${
          dragging ? "cursor-grabbing scale-105" : "cursor-grab"
        }`}
        style={{ left: `${pct}%` }}
      >
        <svg width="26" height="16" viewBox="0 0 26 16" fill="none" aria-hidden="true">
          <path
            d="M6.5 2.5 1.5 8l5 5.5M19.5 2.5l5 5.5-5 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 3.5v9M15 3.5v9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </button>

      {/* Says what the control does, for anyone who missed the nudge or has
          motion turned off. It steps aside once the reader takes over. */}
      <span
        className={`pointer-events-none absolute top-[calc(22%+2.75rem)] z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/25 bg-black/45 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm transition-opacity duration-500 lg:top-[calc(50%+2.75rem)] motion-reduce:transition-none ${
          hinting ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: `${pct}%` }}
      >
        {hint}
      </span>

      {/* Stage labels sit near the top of the frame: the bottom corners belong
          to the cookie notice and the chat launcher, which sat over them. Each
          one tracks its own stage, so they always read in pipeline order. The
          first two are hidden on small screens, where the copy panel is full
          width and there is no room to the left of the window. */}
      <span
        className="pointer-events-none absolute top-24 hidden rounded-lg border border-[var(--color-ink)]/10 bg-white/85 px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] backdrop-blur-sm lg:top-28 lg:block"
        style={{ right: `calc(100% - ${pct}% + ${BAND} + 0.75rem)` }}
      >
        {first.label}
      </span>
      <span
        className="pointer-events-none absolute top-24 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/30 bg-black/55 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm lg:top-28 lg:block"
        style={{ left: `${pct}%` }}
      >
        {middle.label}
      </span>
      <span
        className={`pointer-events-none absolute top-24 whitespace-nowrap rounded-lg border border-white/25 bg-black/40 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm transition-opacity duration-200 lg:top-28 motion-reduce:transition-none ${
          pct > LAST_LABEL_MAX ? "opacity-0" : "opacity-100"
        }`}
        /* Clamped, then faded out: near full travel an unclamped label ran off
           the frame, and the clamped one collided with the window's own label.
           There is barely any print left to point at by then either. */
        style={{
          left: `min(calc(${pct}% + ${BAND} + 0.75rem), calc(100% - 8rem))`,
        }}
      >
        {last.label}
      </span>
    </div>
  );
}
