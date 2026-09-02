"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Replaces the native cursor (on fine-pointer devices) with a static glassy
 * circle, a dot in its center, and a live readout of the current x / y
 * coordinates. Everything tracks the pointer exactly (no trailing / easing).
 * Renders nothing on touch devices, where there is no cursor to follow.
 *
 * Listens for a `nbil:cursor-merge` window event ({ detail: { active } }) so
 * an interactive shape elsewhere on the page (e.g. a hovered state on the
 * installations map) can hide this cursor for as long as the pointer sits
 * over it — the shape's own outline takes over as the pointer feedback,
 * rather than the two competing for attention.
 */
export function CoordinateCursor() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only take over the cursor when there's an actual mouse / trackpad.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    let raf = 0;
    let x = 0;
    let y = 0;
    let shown = false;
    let merged = false;

    const render = () => {
      raf = 0;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (textRef.current) {
        textRef.current.textContent = `x ${Math.round(x)}  ·  y ${Math.round(y)}`;
      }
    };

    const show = (v: boolean) => {
      if (v === shown) return;
      shown = v;
      if (wrapRef.current) wrapRef.current.style.opacity = v ? "1" : "0";
    };

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!merged) show(true);
      if (!raf) raf = requestAnimationFrame(render);
    };
    const leave = () => show(false);
    const merge = (e: Event) => {
      merged = Boolean((e as CustomEvent<{ active: boolean }>).detail?.active);
      if (merged) show(false);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    window.addEventListener("nbil:cursor-merge", merge);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("nbil:cursor-merge", merge);
      root.classList.remove("custom-cursor-active");
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] opacity-0 transition-opacity duration-200"
    >
      {/* Static glassy circle with a dot in the middle, pinned to the pointer */}
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 shadow-[0_2px_8px_rgba(2,12,27,0.25)] backdrop-blur-[2px]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
      </div>
      <div ref={labelRef} className="fixed left-0 top-0">
        <span
          ref={textRef}
          className="absolute left-5 top-5 whitespace-nowrap rounded-md border border-white/15 bg-[#081235] px-2 py-1 text-[11px] tracking-tight text-white shadow-lg"
        />
      </div>
    </div>
  );
}

export default CoordinateCursor;
