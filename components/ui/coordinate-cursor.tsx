"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Replaces the native cursor (on fine-pointer devices) with a dot that
 * trails the pointer and a live readout of the current x / y coordinates.
 * Renders nothing on touch devices, where there is no cursor to follow.
 */
export function CoordinateCursor() {
  const [enabled, setEnabled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
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

    const render = () => {
      raf = 0;
      if (dotRef.current) {
        // Anchor the arrow's tip (top-left of the SVG) to the pointer.
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
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
      show(true);
      if (!raf) raf = requestAnimationFrame(render);
    };
    const leave = () => show(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
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
      <div ref={dotRef} className="fixed left-0 top-0">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          className="drop-shadow-[0_2px_6px_rgba(2,12,27,0.45)]"
          style={{ transform: "translate(-5px, -5px)" }}
        >
          {/* Soft, rounded triangle blob (brand blue), tip anchored to the pointer */}
          <path
            d="M6 5 L8 25 L25 15 Z"
            fill="var(--color-brand)"
            stroke="var(--color-brand)"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div ref={labelRef} className="fixed left-0 top-0">
        <span
          ref={textRef}
          className="absolute left-5 top-5 whitespace-nowrap rounded-md border border-white/15 bg-[#081235] px-2 py-1 font-mono text-[11px] tracking-tight text-white shadow-lg"
        />
      </div>
    </div>
  );
}

export default CoordinateCursor;
