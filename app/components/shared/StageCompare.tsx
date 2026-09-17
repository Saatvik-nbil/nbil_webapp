"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * Manual three-stage wipe for a hero.
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
 * see.
 *
 * The frame fills whatever box its parent gives it. Both heroes make that box
 * a bounded card below `lg` and the full-bleed section from `lg` up, so the
 * chrome below `lg` is sized for a card a couple of hundred pixels tall rather
 * than for a whole viewport with a copy panel over it.
 *
 * Touch: the root takes `touch-action: pan-y`, so the browser keeps vertical
 * scrolling and the horizontal axis is ours. Without it the browser claims the
 * gesture as a pan and cancels the drag, and `preventDefault` on pointermove
 * cannot win it back. A touch drag is only committed once the movement proves
 * horizontal, so swiping to scroll from anywhere on the frame never jogs the
 * window.
 */

/** Half the window's width, as a CSS length. Set on the frame as `--band` so
 *  the clip paths, the window chrome and the labels all key off one number. */
const BAND = "var(--band)";

const STEP = 2;

/** How far a touch has to travel before it counts as a drag rather than the
 *  start of a scroll. */
const SLOP = 6;

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
  /** Merged over `travel` below sm. From lg up the copy panel owns the left of
   *  the frame and the window has to stay clear of it; on a phone the panel is
   *  above the card instead, so the window can sit further left. */
  phoneTravel?: Partial<{ min: number; max: number; start: number }>;
  /** Said beside the handle for anyone who missed the nudge. */
  hint: string;
  /** How far the opening nudge walks either side of its resting place. */
  nudge?: number;
  /** A light wash over the stages, so a copy panel laid on top of the frame has
   *  something to sit against. Drawn under the window chrome, so it never dims
   *  the handle. */
  wash?: boolean;
  /** object-position for all three frames. The sources are 16:9 and so is the
   *  frame at every width, so the default crops nothing. */
  objectPosition?: string;
};

/** The pointer that owns the current gesture. `live` is false while a touch is
 *  down but has not yet proved itself horizontal. */
type Gesture = { id: number; x: number; y: number; live: boolean };

/** useLayoutEffect on the client, useEffect on the server, where there is no
 *  layout to run before and React warns about the real one. */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function StageCompare({
  stages,
  travel,
  phoneTravel,
  hint,
  nudge = 10,
  wash = false,
  objectPosition = "object-center",
}: Props) {
  /** Matched on the client, where the viewport is knowable. Both this and the
   *  effect that follows the resting place run before paint, so hydration
   *  settles a phone onto its own travel in one go rather than painting the
   *  server's desktop position first and snapping. */
  const [onPhone, setOnPhone] = useState(false);
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 639.98px)");
    const sync = () => setOnPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { min: MIN, max: MAX, start: START } =
    onPhone && phoneTravel ? { ...travel, ...phoneTravel } : travel;
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
  const gesture = useRef<Gesture | null>(null);

  const takeOver = useCallback(() => {
    touched.current = true;
    setHinting(false);
  }, []);

  /** The range can change under the window when the viewport crosses sm. A
   *  reader who has already moved it keeps their position, clamped into the new
   *  range; otherwise the window takes up the new resting place. */
  useIsoLayoutEffect(() => {
    if (touched.current) setPct((v) => Math.min(MAX, Math.max(MIN, v)));
    else setPct(START);
  }, [MIN, MAX, START]);

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

  /** Capture the pointer so a fast drag that leaves the frame keeps working and
   *  releasing anywhere ends it. Captured events retarget to whichever element
   *  took the capture and still bubble, so the frame's move and end handlers
   *  serve the handle's drags too. */
  const capture = (e: React.PointerEvent, live: boolean) => {
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, live };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onFramePointerDown = (e: React.PointerEvent) => {
    if (gesture.current) return;
    takeOver();
    // A mouse press on the frame is unambiguous, so it jumps the window at
    // once. A touch has to prove it is a drag first: the frame covers the whole
    // hero, and a swipe to scroll starts on it far more often than a drag does.
    const live = e.pointerType === "mouse";
    capture(e, live);
    if (live) {
      setDragging(true);
      setFromClientX(e.clientX);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (!g.live) {
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;
      if (Math.abs(dx) <= SLOP || Math.abs(dx) <= Math.abs(dy)) return;
      g.live = true;
      setDragging(true);
    }
    setFromClientX(e.clientX);
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    setDragging(false);
  };

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
      /* `isolate` keeps the handle, the hint and the labels inside this frame.
         Without it their `z-10` escapes into the hero section's stacking
         context and paints them over the copy panel, where the handle also ate
         taps on the headline. */
      className="absolute inset-0 isolate select-none touch-pan-y [--band:40px] sm:[--band:52px] lg:[--band:78px]"
      onPointerDown={onFramePointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
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

      {/* A light wash over all three stages so a copy panel laid on the frame
          has something to sit against without flattening any of them. */}
      {wash && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[rgba(10,20,34,0.12)]"
        />
      )}

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

      {/* Handle. `touch-none` rather than the frame's `pan-y`: a finger on the
          handle is only ever there to drag it, so it should not also scroll. */}
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
          if (gesture.current) return;
          takeOver();
          capture(e, true);
          setDragging(true);
        }}
        className={`absolute top-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border border-white/70 bg-white/20 text-white shadow-[0_8px_30px_rgba(2,8,20,0.35)] backdrop-blur-md transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent motion-reduce:transition-none ${
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
          motion turned off. It steps aside once the reader takes over.
          In the card it sits on the bottom edge, clear of the handle and free
          to wrap; from lg up, where the frame is the whole hero, it tracks the
          handle as before. */}
      <span
        className={`pointer-events-none absolute bottom-3 left-1/2 z-10 max-w-[calc(100%-2rem)] -translate-x-1/2 text-balance rounded-lg border border-white/25 bg-black/45 px-3 py-1.5 text-center text-[12.5px] font-medium text-white backdrop-blur-sm transition-opacity duration-500 lg:bottom-auto lg:left-[var(--hint-left)] lg:top-[calc(50%+2.75rem)] lg:max-w-none lg:whitespace-nowrap motion-reduce:transition-none ${
          hinting ? "opacity-100" : "opacity-0"
        }`}
        style={{ "--hint-left": `${pct}%` } as React.CSSProperties}
      >
        {/* Below sm the list and the markers already name the stages, so the
            hint only has to say what to do. The full sentence wrapped to three
            lines there and sat over the handle it was describing. */}
        <span className="sm:hidden">Drag to compare</span>
        <span className="hidden sm:inline">{hint}</span>
      </span>

      {/* Below sm the three tracking chips would collide and the last one
          would run off the card, so the naming splits in two: the stages are
          listed once, in the band of plain background that sits left of the
          window at every point in its travel, and a numbered marker rides the
          top edge above each layer, pointing down into it and travelling with
          the window. The list is what the numbers mean; the markers are where
          the layers are. */}
      <ol className="pointer-events-none absolute left-3 top-8 z-10 flex flex-col items-start gap-0.5 sm:hidden">
        {stages.map((stage, i) => (
          <li
            key={stage.label}
            className="flex items-center gap-1 rounded-lg border border-[var(--color-ink)]/10 bg-white/85 px-2 py-0.5 text-[11px] font-medium text-[var(--color-ink)] backdrop-blur-sm"
          >
            <span className="font-semibold tabular-nums text-[var(--color-brand-strong)]">
              {i + 1}
            </span>
            {stage.label}
          </li>
        ))}
      </ol>

      {/* The markers. Each sits over the middle of its own layer: the first
          stage runs from the frame's left edge to the window, the middle one
          is what the window shows, and the last runs from the window to the
          right edge. Clamped so a marker never rides off the card, and the
          last one goes when the window has eaten the layer it points at. */}
      <div aria-hidden="true" className="sm:hidden">
        {[
          `calc((${pct}% - ${BAND}) / 2)`,
          `${pct}%`,
          `calc((${pct}% + ${BAND} + 100%) / 2)`,
        ].map((centre, i) => (
          <span
            key={i}
            className={`pointer-events-none absolute top-1.5 z-10 flex -translate-x-1/2 flex-col items-center transition-opacity duration-200 motion-reduce:transition-none ${
              i === 2 && pct > LAST_LABEL_MAX ? "opacity-0" : "opacity-100"
            }`}
            style={{ left: `clamp(1rem, ${centre}, calc(100% - 1rem))` }}
          >
            <span className="flex size-[18px] items-center justify-center rounded-full border border-white/35 bg-[rgba(10,20,34,0.72)] text-[10.5px] font-semibold leading-none tabular-nums text-white">
              {i + 1}
            </span>
            <span className="size-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-[rgba(10,20,34,0.72)]" />
          </span>
        ))}
      </div>

      {/* Stage labels sit on the top edge of the frame: from lg up the bottom
          corners belong to the cookie notice and the chat launcher, which sat
          over them. Each one tracks its own stage, so they always read in
          pipeline order. All three give way to the static list below sm,
          where they would collide and name the same stages twice. */}
      <span
        className="pointer-events-none absolute top-3 hidden rounded-lg border border-[var(--color-ink)]/10 bg-white/85 px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)] backdrop-blur-sm sm:block lg:top-28"
        style={{ right: `calc(100% - ${pct}% + ${BAND} + 0.75rem)` }}
      >
        {first.label}
      </span>
      <span
        className="pointer-events-none absolute top-3 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/30 bg-black/55 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm sm:block lg:top-28"
        style={{ left: `${pct}%` }}
      >
        {middle.label}
      </span>
      <span
        className={`pointer-events-none absolute top-3 hidden whitespace-nowrap rounded-lg border border-white/25 bg-black/40 px-3 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-sm transition-opacity duration-200 sm:block lg:top-28 motion-reduce:transition-none ${
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
