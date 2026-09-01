"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The fully assembled NP, 2560×1440 — same 16:9 as the stage, so at scale 1 it
// fills the canvas exactly. (First frame of the old sequence; the rest is unused.)
const SRC = "/images/np-seq/np-001.jpg";

type Stop = {
  /** Which side of the stage the callout card sits on. */
  side: "left" | "right";
  /** Centre of the part in the frame, 0–1. */
  fx: number;
  fy: number;
  /** How far the camera pushes in on it. */
  scale: number;
  /**
   * Where on the stage the part is parked vertically, 0–1. Defaults to the
   * middle; raise it for parts near the top of the frame so the zoom doesn't
   * leave a band of empty backdrop above the machine.
   */
  ay?: number;
  title: string;
  value: string;
  hero?: boolean;
};

// A top-to-bottom descent through the machine. fx/fy are read off the frame;
// scale is capped at ~2.2 because beyond that the 2560px source starts to soften
// against a 2× DPR canvas.
const STOPS: Stop[] = [
  { side: "right", fx: 0.56, fy: 0.18, scale: 1.9, ay: 0.38, title: "Extruder", value: "Swappable head — 2 to 3 slots: pneumatic, pellet and motor-driven" },
  { side: "left", fx: 0.56, fy: 0.34, scale: 2.0, title: "Syringe", value: "3CC, 5CC and 10CC barrels, temperature-controlled from 8 to 65 °C" },
  { side: "right", fx: 0.53, fy: 0.5, scale: 1.8, title: "4th axis", value: "Rotary spindle for true cylindrical and helical, non-planar paths", hero: true },
  { side: "left", fx: 0.52, fy: 0.565, scale: 2.0, title: "Build platform", value: "Flat bed for conventional planar printing — 120 × 70 × 50 mm, 4 to 80 °C" },
  { side: "right", fx: 0.41, fy: 0.67, scale: 2.2, title: "Pressure control knob", value: "Per-channel regulator with live readout — 0.02 to 8 Bar" },
  { side: "left", fx: 0.818, fy: 0.575, scale: 2.2, title: "Emergency stop", value: "Latching e-stop cuts motion and pressure instantly" },
];

/** Timeline beat at which stop `i` is featured. */
const beatOf = (i: number) => i * 2 + 1;
const END_BEAT = beatOf(STOPS.length - 1) + 1.6;

export default function AnatomyScroll() {
  const pinRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // Camera: the focus point (fx,fy) in the frame is placed at stage anchor
  // (ax,ay) and magnified by `scale`. The zoom is rendered by scaling the source
  // draw — not a CSS transform — so the full-res image stays sharp at every step.
  const camRef = useRef({ scale: 1, fx: 0.5, fy: 0.5, ax: 0.5, ay: 0.5 });
  // The frame is a JPEG, so its "white" backdrop isn't pure #fff. Sample it once
  // and fill uncovered canvas with that exact colour so there's no visible seam.
  const bgRef = useRef<string>("#ffffff");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  function sampleBg(img: HTMLImageElement) {
    try {
      const c = document.createElement("canvas");
      c.width = 8;
      c.height = 8;
      const cx = c.getContext("2d");
      if (!cx) return;
      cx.drawImage(img, 0, 0, 8, 8);
      const d = cx.getImageData(0, 0, 1, 1).data;
      bgRef.current = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    } catch {
      /* tainted canvas — keep default */
    }
  }

  function sizeCanvas() {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(wrap.clientWidth * dpr);
    canvas.height = Math.round(wrap.clientHeight * dpr);
    draw();
  }

  function draw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const cam = camRef.current;
    const dW = cw * cam.scale;
    const dH = ch * cam.scale;
    const dx = cw * (cam.ax - cam.fx * cam.scale);
    const dy = ch * (cam.ay - cam.fy * cam.scale);
    ctx.fillStyle = bgRef.current;
    ctx.fillRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dW, dH);
  }

  // Load the single frame.
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = SRC;
    img.onload = () => {
      if (cancelled) return;
      sampleBg(img);
      sizeCanvas();
      setReady(true);
      ScrollTrigger.refresh();
    };
    imgRef.current = img;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // Reduced motion: hold the assembled machine, no pin, no camera. The parts
    // are listed statically underneath instead of as animated overlays.
    if (isReduced) return () => window.removeEventListener("resize", sizeCanvas);

    // Redraw every frame so the scrub's smooth catch-up stays in sync.
    const render = () => draw();
    gsap.ticker.add(render);

    const ctx = gsap.context(() => {
      const cam = camRef.current;

      const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 7,
          pin: pinRef.current,
          scrub: 1.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.set(cam, { scale: 1, fx: 0.5, fy: 0.5, ax: 0.5, ay: 0.5 }, 0);

      STOPS.forEach((s, i) => {
        // Park the part opposite its card so the leader line has room to run.
        const ax = s.side === "right" ? 0.34 : 0.66;
        const t = beatOf(i);

        // Camera glides in and settles on the part.
        tl.to(cam, { scale: s.scale, fx: s.fx, fy: s.fy, ax, ay: s.ay ?? 0.5, duration: 1.0 }, t - 1.0);

        // Then the dot lands, the line draws out from it, and the card arrives.
        tl.fromTo(`.anat-dot-${i}`, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" }, t - 0.15);
        tl.fromTo(`.anat-line-${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.out" }, t + 0.05);
        tl.fromTo(
          `.anat-card-${i}`,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          t + 0.35,
        );

        // Clear it before the camera moves on.
        tl.to([`.anat-card-${i}`, `.anat-dot-${i}`], { autoAlpha: 0, duration: 0.35 }, t + 1.05);
        tl.to(`.anat-line-${i}`, { scaleX: 0, duration: 0.35 }, t + 1.05);
      });

      // Pull back to the whole assembled machine.
      tl.to(cam, { scale: 1, fx: 0.5, fy: 0.5, ax: 0.5, ay: 0.5, duration: 1.0 }, END_BEAT - 1.0);
    }, pinRef);

    return () => {
      window.removeEventListener("resize", sizeCanvas);
      gsap.ticker.remove(render);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section aria-labelledby="anatomy-heading" className="relative bg-[var(--color-surface)]">
      <div ref={pinRef} className="relative h-[100dvh] overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-6 pt-24 lg:pt-28 shrink-0">
          <h2
            id="anatomy-heading"
            className="font-display text-[1.6rem] lg:text-[2.4rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.08] max-w-[22ch]"
          >
            A closer look at every part
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div
            ref={wrapRef}
            className="relative w-full max-w-[1100px] aspect-video overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white"
          >
            <canvas
              ref={canvasRef}
              className={`w-full h-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
              aria-hidden="true"
            />

            {/* Animated callouts. Hidden from assistive tech — the same content is
                listed in the static list below, which screen readers get instead. */}
            {!reduced &&
              STOPS.map((s, i) => {
                // The camera parks the part at this anchor, so the marker is fixed.
                const dotX = s.side === "right" ? 34 : 66;
                const rowY = `${(s.ay ?? 0.5) * 100}%`;
                const line =
                  s.side === "right"
                    ? { left: "34%", width: "34%", transformOrigin: "left center" }
                    : { left: "32%", width: "34%", transformOrigin: "right center" };
                const accent = s.hero ? "var(--color-brand)" : "var(--color-brand-strong)";
                return (
                  <div key={s.title} className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
                    <span
                      className={`anat-line-${i} absolute h-[2px]`}
                      style={{
                        top: rowY,
                        left: line.left,
                        width: line.width,
                        transformOrigin: line.transformOrigin,
                        transform: "scaleX(0)",
                        background: "var(--color-brand)",
                      }}
                    />
                    <span
                      className={`anat-dot-${i} absolute size-[12px] rounded-full ring-4 ring-[var(--color-brand)]/20`}
                      style={{
                        left: `${dotX}%`,
                        top: rowY,
                        marginLeft: -6,
                        marginTop: -6,
                        background: "var(--color-brand)",
                        opacity: 0,
                      }}
                    />
                    {/* The wrapper owns the vertical centring so GSAP is free to
                        drive `y` on the card without clobbering translateY(-50%). */}
                    <div
                      className="absolute max-w-[55%] sm:max-w-[250px]"
                      style={{
                        top: rowY,
                        transform: "translateY(-50%)",
                        ...(s.side === "right" ? { right: "3%" } : { left: "3%" }),
                      }}
                    >
                      <div
                        className={`anat-card-${i} flex flex-col gap-1 rounded-xl border px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-sm`}
                        style={{
                          borderColor: s.hero ? "var(--color-brand)" : "var(--color-hairline)",
                          background: s.hero
                            ? "color-mix(in srgb, var(--color-brand-surface) 88%, transparent)"
                            : "color-mix(in srgb, var(--color-surface) 88%, transparent)",
                          opacity: 0,
                        }}
                      >
                        <span
                          className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em]"
                          style={{ color: accent }}
                        >
                          {s.title}
                        </span>
                        <span className="text-[12px] sm:text-[13.5px] font-medium text-[var(--color-ink)] leading-snug">
                          {s.value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="shrink-0 pb-6 flex justify-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
            {reduced ? "The parts, in order" : "Keep scrolling"}
          </span>
        </div>
      </div>

      {/* The same six parts as text: the accessible version of the tour, and the
          full replacement for it under reduced motion. */}
      <div className={reduced ? "max-w-7xl mx-auto px-6 pb-20" : "sr-only"}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {STOPS.map((s) => (
            <li
              key={s.title}
              className="flex flex-col gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5"
            >
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-brand-strong)]">
                {s.title}
              </span>
              <span className="text-[13.5px] text-[var(--color-ink-muted)] leading-snug">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
