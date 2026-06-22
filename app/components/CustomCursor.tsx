"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   CustomCursor
   – Tiny inner dot that snaps directly to the mouse
   – Larger outer ring that lags behind with easing (lerp 0.08)
   – On hover (a / button / heading / span): ring morphs into an organic blob
   – On mousedown: ring snaps circular + shrinks briefly
   ───────────────────────────────────────────────────────────────────────────── */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // State
    const pos    = { mx: 0, my: 0, rx: 0, ry: 0 };
    let morphT   = 0;
    let hovering = false;
    let rafId: number;

    /* ── Move inner dot immediately ── */
    const onMouseMove = (e: MouseEvent) => {
      pos.mx = e.clientX;
      pos.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    /* ── Animate ring with lerp + blob morph ── */
    const animRing = () => {
      pos.rx += (pos.mx - pos.rx) * 0.08;
      pos.ry += (pos.my - pos.ry) * 0.08;

      const el = ringRef.current;
      if (el) {
        el.style.transform = `translate(${pos.rx}px, ${pos.ry}px)`;

        if (hovering) {
          morphT += 0.014;
          const t  = morphT;
          const a1 = 40 + Math.sin(t * 1.2)       * 7;
          const a2 = 60 - Math.sin(t * 1.2)       * 7;
          const a3 = 55 + Math.sin(t * 0.8  + 1)  * 5;
          const a4 = 45 - Math.sin(t * 0.8  + 1)  * 5;
          const b1 = 45 + Math.sin(t * 1.0  + 2)  * 5;
          const b2 = 47 - Math.sin(t * 1.0  + 2)  * 5;
          const b3 = 53 + Math.sin(t * 1.3  + 0.5)* 4;
          const b4 = 55 - Math.sin(t * 1.3  + 0.5)* 4;
          if (!document.body.classList.contains("cursor-click")) {
            el.style.borderRadius =
              `${a1}% ${a2}% ${a3}% ${a4}% / ${b1}% ${b2}% ${b3}% ${b4}%`;
          }
        } else {
          morphT = 0;
          el.style.borderRadius = "50%";
        }
      }

      rafId = requestAnimationFrame(animRing);
    };
    rafId = requestAnimationFrame(animRing);
    document.addEventListener("mousemove", onMouseMove);

    /* ── Click pulse ── */
    const onDown = () => document.body.classList.add("cursor-click");
    const onUp   = () => document.body.classList.remove("cursor-click");
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);

    /* ── Hover detection on interactive elements ── */
    const addHover    = () => { hovering = true;  document.body.classList.add("cursor-hover");    };
    const removeHover = () => { hovering = false; document.body.classList.remove("cursor-hover"); };

    const SELECTORS = "a, button, [role='button'], h1, h2, h3, p, span, label, input, textarea, select";

    const attach = () => {
      document.querySelectorAll(SELECTORS).forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };
    attach();

    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(rafId);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      {/* Lens distortion + edge shimmer SVG filters */}
      <svg
        width="0"
        height="0"
        style={{ position: "fixed", pointerEvents: "none", zIndex: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="cursor-lens"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="distorted" />
            <feGaussianBlur in="distorted" stdDeviation="0.3" result="softened" />
            <feComposite in="softened" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="cursor-shimmer" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Inner dot */}
      <div
        ref={dotRef}
        id="cursor-dot"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--color-brand)",
          pointerEvents: "none",
          zIndex: 9999,
          marginLeft: -3,
          marginTop: -3,
          willChange: "transform",
          transition: "width 0.2s ease, height 0.2s ease, background 0.2s ease",
          filter: "url(#cursor-shimmer)",
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        id="cursor-ring"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(109,40,217,0.55)",
          background: "rgba(109,40,217,0.05)",
          backdropFilter: "blur(2px) url(#cursor-lens)",
          WebkitBackdropFilter: "blur(2px)",
          pointerEvents: "none",
          zIndex: 9998,
          marginLeft: -18,
          marginTop: -18,
          willChange: "transform, border-radius",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease",
          boxShadow: "0 0 0 1px rgba(109,40,217,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      />
    </>
  );
}
