"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manual before/after wipe for the consultancy hero.
 *
 * Both frames are the same subject shot from the same angle, so the divider
 * reads as one object changing state rather than two pictures side by side:
 * the printed construct to the left of the handle, the CAD it was built from
 * to the right.
 *
 * There is no autoplay. The reveal only moves when the reader moves it, by
 * drag, click, or arrow keys on the handle.
 *
 * The travel is clamped to the right of the frame. Both images put the
 * subject there and leave the left of the frame as plain background, which is
 * where the hero's copy panel sits: letting the handle run under the panel
 * would mean dragging something the reader cannot see. For the same reason
 * the handle drops below the panel on small screens, where the panel is full
 * width.
 */

const MIN = 52;
const MAX = 96;
const START = 68;
const STEP = 2;

/** Cubic ease-in-out, so the hint accelerates and settles rather than sliding
 *  at a constant speed. */
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Where the intro nudge travels, in order, and how long each leg takes. */
const NUDGE: Array<{ to: number; ms: number }> = [
  { to: START + 10, ms: 620 },
  { to: START - 10, ms: 900 },
  { to: START, ms: 620 },
];

export default function ModelCompare() {
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

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(MAX, Math.max(MIN, raw)));
  }, []);

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

    let frame = 0;
    let timer = 0;
    let cancelled = false;

    const leg = (index: number, from: number) => {
      if (cancelled || touched.current) return;
      const step = NUDGE[index];
      if (!step) {
        setHinting(false);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled || touched.current) return;
        const t = Math.min(1, (now - start) / step.ms);
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
  }, []);

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

  return (
    <div
      ref={frameRef}
      className="absolute inset-0 select-none"
      onPointerDown={(e) => {
        // Only the bare frame starts a drag: the copy panel above it keeps
        // its own clicks.
        takeOver();
        setDragging(true);
        setFromClientX(e.clientX);
      }}
    >
      {/* Bottom layer: the CAD the construct was modelled from. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/consultancy/cad-model.webp"
        alt="CAD model of a bifurcated vascular scaffold on a drawing grid"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center] lg:object-center"
      />

      {/* Top layer: the printed construct, clipped to the left of the handle. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/consultancy/printed-model.webp"
        alt="The same scaffold bioprinted, held in solution"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center] lg:object-center"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      />

      {/* Divider: a real seam, not a hairline. A dark core keeps it readable
          on the white CAD grid, the white edges keep it readable on the blue,
          and the outer glow lifts it off both. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
        style={{ left: `${pct}%` }}
      >
        <div className="h-full w-[6px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_28%,rgba(10,20,34,0.55)_50%,rgba(255,255,255,0.9)_72%,rgba(255,255,255,0)_100%)] shadow-[0_0_18px_rgba(255,255,255,0.6)]" />
      </div>

      {/* Handle */}
      <button
        type="button"
        role="slider"
        aria-label="Compare the CAD model with the bioprinted construct"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)}% bioprinted construct`}
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
        Slide to reveal the full bioprinted part
      </span>

      {/* Side labels sit near the top of the frame: the bottom corners belong
          to the cookie notice and the chat launcher, which sat over them. */}
      <span className="pointer-events-none absolute right-5 top-24 rounded-lg border border-[var(--color-ink)]/10 bg-white/85 px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] backdrop-blur-sm lg:right-8 lg:top-28">
        CAD model
      </span>
      <span
        className="pointer-events-none absolute top-24 rounded-lg border border-white/25 bg-black/40 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm lg:top-28"
        style={{ right: `calc(100% - ${pct}% + 1.25rem)` }}
      >
        Bioprinted
      </span>
    </div>
  );
}
