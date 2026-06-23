"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 152;
const framePath = (i: number) => `/images/np-seq/np-${String(i + 1).padStart(3, "0")}.jpg`;

type Stop = {
  side: "left" | "right";
  fy: number; // vertical centre of the part at the moment it is featured (0–1)
  fx?: number; // horizontal centre of the part (defaults to 0.5)
  scale: number; // zoom factor
  at: number; // timeline beat (0–10) where the part is featured
  title: string;
  value: string;
  hero?: boolean;
};

// Parts the machine separates into, top → bottom. fx is ~0.5 for all (centred).
// `at` is the timeline beat (0–10) where the part is featured — chosen so the
// part has separated by then while the rest of the machine is still blooming
// apart, and `fy` is the part's vertical centre at that moment.
const STOPS: Stop[] = [
  { side: "right", fy: 0.22, fx: 0.57, scale: 1.5, at: 4.4, title: "Swappable print head", value: "2–3 extruder slots · pneumatic, pellet & motor-driven" },
  { side: "left", fy: 0.34, scale: 1.5, at: 5.4, title: "Precision motion", value: "Better than 10 µm movement precision" },
  { side: "right", fy: 0.45, scale: 1.7, at: 6.3, title: "Rotatory spindle", value: "True cylindrical & helical, non-planar paths", hero: true },
  { side: "left", fy: 0.55, scale: 1.55, at: 7.2, title: "Build platform", value: "120 × 70 × 50 mm · bed 4–80 °C" },
  { side: "right", fy: 0.85, scale: 1.55, at: 8.6, title: "Embedded controller", value: "Runs Dhee · UV & visible crosslinking" },
];

const FX = 0.5; // parts are horizontally centred

export default function ExplodedScroll() {
  const pinRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ i: 0 });
  // Camera: focus point (fx,fy) in the frame is placed at stage anchor (ax,ay)
  // and magnified by `scale`. The zoom is rendered by scaling the source image
  // into the canvas (not a CSS transform) so the full 2560px source stays sharp.
  const camRef = useRef({ scale: 1, fx: 0.5, fy: 0.5, ax: 0.5, ay: 0.5 });
  // Frames are JPEGs, so their "white" backdrop isn't pure #fff. We sample it
  // once and fill any uncovered canvas area with that exact colour, so the
  // zoomed-out / edge views show no seam between the fill and the photo.
  const bgRef = useRef<string>("#ffffff");
  const [loaded, setLoaded] = useState(0);
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

  // Preload the frame sequence.
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        count++;
        if (i === 0) {
          sampleBg(img);
          draw(0);
        }
        if (count % 8 === 0 || count === FRAME_COUNT) setLoaded(count);
        if (count === FRAME_COUNT) ScrollTrigger.refresh();
      };
      imgs[i] = img;
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sizeCanvas() {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(wrap.clientWidth * dpr);
    canvas.height = Math.round(wrap.clientHeight * dpr);
    draw(frameRef.current.i);
  }

  function draw(index?: number) {
    const canvas = canvasRef.current;
    const idx = index ?? frameRef.current.i;
    const img = imagesRef.current[Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(idx)))];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const cam = camRef.current;
    // The frame is 16:9 like the canvas, so at scale 1 it fills it exactly.
    // Scaling + translating the *source draw* keeps it sampled from the full-res
    // image at every zoom level, so it never pixelates the way a CSS scale would.
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

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    if (isReduced) {
      const finish = () => {
        frameRef.current.i = FRAME_COUNT - 1;
        draw(FRAME_COUNT - 1);
      };
      const last = imagesRef.current[FRAME_COUNT - 1];
      if (last?.complete) finish();
      else if (last) last.addEventListener("load", finish);
      gsap.set(".exp-stop", { autoAlpha: 1 });
      return () => window.removeEventListener("resize", sizeCanvas);
    }

    // Redraw the canvas every frame so the scrub's smooth catch-up stays in sync.
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

      // 1. The machine disintegrates continuously across the whole scroll, so the
      //    camera moves in (step 2) while it is still blooming apart.
      tl.set(cam, { scale: 1, fx: 0.5, fy: 0.5, ax: 0.5, ay: 0.5 }, 0);
      tl.to(frameRef.current, { i: FRAME_COUNT - 1, ease: "none", duration: 9.3 }, 0.3);

      // 2. While it disintegrates, the camera glides down through each part with a
      //    gentle zoom (so the rest of the machine stays in view), a blue leader
      //    line + spec, one callout at a time with overlapping cross-fades.
      STOPS.forEach((s, i) => {
        const ax = s.side === "right" ? 0.34 : 0.66;
        const t = s.at;
        const next = STOPS[i + 1];
        tl.to(cam, { scale: s.scale, fx: s.fx ?? FX, fy: s.fy, ax, ay: 0.5, duration: 1.1 }, t - 1.1);
        tl.fromTo(`.exp-stop-${i}`, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, t - 0.5);
        const outAt = next ? next.at - 0.5 : 9.0;
        tl.to(`.exp-stop-${i}`, { autoAlpha: 0, duration: 0.4 }, outAt);
      });

      // 3. Pull back to reveal the fully exploded machine.
      tl.to(cam, { scale: 1, fx: 0.5, fy: 0.5, ax: 0.5, ay: 0.5, duration: 1.0 }, 9.0);
    }, pinRef);

    return () => {
      window.removeEventListener("resize", sizeCanvas);
      gsap.ticker.remove(render);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section aria-label="Trivima NP anatomy" className="relative bg-[var(--color-surface)]">
      <div ref={pinRef} className="relative h-[100dvh] overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-6 pt-24 lg:pt-28 shrink-0">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)] mb-2">
            Inside the NP
          </p>
          <h2 className="font-display text-[1.6rem] lg:text-[2.4rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.08] max-w-[22ch]">
            Scroll to take it apart
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div
            ref={wrapRef}
            className="relative w-full max-w-[1100px] aspect-video overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white"
          >
            <canvas ref={canvasRef} className="w-full h-full will-change-transform" aria-hidden="true" />

            {pct < 100 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[12px] font-mono text-[var(--color-ink-faint)]">Loading anatomy {pct}%</span>
              </div>
            )}

            {/* Callouts + blue leader lines */}
            {STOPS.map((s, i) => {
              const featureX = s.side === "right" ? 34 : 66;
              const top = reduced ? `${s.fy * 100}%` : "50%";
              // Leader line geometry (percent of stage)
              const line = reduced
                ? s.side === "right"
                  ? { left: "50%", width: "16%" }
                  : { left: "34%", width: "16%" }
                : s.side === "right"
                  ? { left: `${featureX}%`, width: `${68 - featureX}%` }
                  : { left: "32%", width: `${featureX - 32}%` };
              const dotX = reduced ? 50 : featureX;
              const dotY = reduced ? s.fy * 100 : 50;
              const accent = s.hero ? "var(--color-brand)" : "var(--color-brand-strong)";
              return (
                <div
                  key={s.title}
                  className={`exp-stop exp-stop-${i} absolute inset-0 z-10 pointer-events-none`}
                  style={{ opacity: reduced ? 1 : 0 }}
                >
                  {/* leader line */}
                  <span
                    aria-hidden="true"
                    className="absolute h-[2px]"
                    style={{ top: reduced ? `${s.fy * 100}%` : "50%", left: line.left, width: line.width, background: "var(--color-brand)" }}
                  />
                  {/* feature dot */}
                  <span
                    aria-hidden="true"
                    className="absolute size-[12px] rounded-full ring-4 ring-[var(--color-brand)]/20"
                    style={{ left: `${dotX}%`, top: `${dotY}%`, transform: "translate(-50%,-50%)", background: "var(--color-brand)" }}
                  />
                  {/* callout card */}
                  <div
                    className="absolute max-w-[55%] sm:max-w-[240px] flex flex-col gap-1 rounded-xl border px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-sm"
                    style={{
                      top,
                      transform: "translateY(-50%)",
                      ...(s.side === "right" ? { right: "3%" } : { left: "3%" }),
                      borderColor: s.hero ? "var(--color-brand)" : "var(--color-hairline)",
                      background: s.hero ? "color-mix(in srgb, var(--color-brand-surface) 88%, transparent)" : "color-mix(in srgb, var(--color-surface) 88%, transparent)",
                    }}
                  >
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em]" style={{ color: accent }}>
                      {s.title}
                    </span>
                    <span className="text-[12px] sm:text-[13.5px] font-medium text-[var(--color-ink)] leading-snug">
                      {s.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shrink-0 pb-6 flex justify-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
            Keep scrolling
          </span>
        </div>
      </div>
    </section>
  );
}
