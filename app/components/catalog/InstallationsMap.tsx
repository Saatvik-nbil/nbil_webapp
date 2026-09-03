"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MapPin, X } from "@phosphor-icons/react";
import {
  INDIA_STATE_PATHS,
  INDIA_MAP_VIEWBOX,
  INDIA_MAP_WIDTH,
  INDIA_MAP_HEIGHT,
} from "@/lib/india-map-paths";
import {
  getStateInstallations,
  INSTALLED_STATE_IDS,
  INTERNATIONAL_INSTALLATIONS,
  TOTAL_INSTALLATIONS,
} from "@/lib/installations";

const EASE = [0.16, 1, 0.3, 1] as const;
const POPUP_W = 288; // matches the w-72 card below
const MARGIN = 14;

type Popup = {
  stateId: string;
  /** The state's centre in SVG units, kept so the card can be re-anchored
   *  when the page scrolls or resizes under it. */
  cx: number;
  cy: number;
  /** Viewport position of the anchor, derived from cx/cy. */
  x: number;
  y: number;
  pinned: boolean;
};

/**
 * Interactive India map on /trivima: hover (or tap) a state that has a
 * Trivima installation to see who's running one there. Hovering an installed
 * state dispatches `nbil:cursor-merge` so the site's replacement cursor
 * (coordinate-cursor.tsx) hides itself: the state's own glowing outline
 * becomes the pointer feedback instead of the two overlapping.
 */
export default function InstallationsMap() {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [popup, setPopup] = useState<Popup | null>(null);

  const installedCount = INSTALLED_STATE_IDS.size;

  const screenPointFor = useCallback((cx: number, cy: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = rect.width / INDIA_MAP_WIDTH;
    const scaleY = rect.height / INDIA_MAP_HEIGHT;
    const raw = { x: rect.left + cx * scaleX, y: rect.top + cy * scaleY };
    const half = POPUP_W / 2;
    return {
      x: Math.min(Math.max(raw.x, half + MARGIN), window.innerWidth - half - MARGIN),
      // The card renders above this point and can run tall (five-item
      // states), so keep well clear of bottom-docked chrome: the cookie
      // banner, the mobile sticky CTA, not just the viewport edge.
      y: Math.min(Math.max(raw.y, 140), window.innerHeight - 110),
    };
  }, []);

  const openFor = useCallback(
    (stateId: string, cx: number, cy: number, pinned: boolean) => {
      const { x, y } = screenPointFor(cx, cy);
      setPopup({ stateId, cx, cy, x, y, pinned });
    },
    [screenPointFor]
  );

  function handleEnter(stateId: string, cx: number, cy: number) {
    if (!INSTALLED_STATE_IDS.has(stateId)) return;
    window.dispatchEvent(new CustomEvent("nbil:cursor-merge", { detail: { active: true } }));
    openFor(stateId, cx, cy, false);
  }

  function handleLeave() {
    window.dispatchEvent(new CustomEvent("nbil:cursor-merge", { detail: { active: false } }));
    setPopup((p) => (p?.pinned ? p : null));
  }

  function handleClick(stateId: string, cx: number, cy: number) {
    if (!INSTALLED_STATE_IDS.has(stateId)) return;
    openFor(stateId, cx, cy, true);
  }

  function handleKeyDown(
    e: React.KeyboardEvent,
    stateId: string,
    cx: number,
    cy: number
  ) {
    if (!INSTALLED_STATE_IDS.has(stateId)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFor(stateId, cx, cy, true);
    }
    if (e.key === "Escape") setPopup(null);
  }

  // Dismiss a pinned card on Escape or an outside click.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPopup(null);
    }
    function onPointerDown(e: PointerEvent) {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-installations-popup]") && !el.closest("[data-state-path]")) {
        setPopup(null);
      }
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  // The card is anchored in viewport coordinates, so it has to follow the map
  // when the page moves under it. This used to close the card instead, which
  // made the section look broken at random: Lenis carries on emitting scroll
  // events through its momentum, so a card opened moments after a scroll was
  // dismissed before it had finished animating in.
  useEffect(() => {
    let raf = 0;
    const reposition = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPopup((p) => {
          if (!p) return p;
          const { x, y } = screenPointFor(p.cx, p.cy);
          return x === p.x && y === p.y ? p : { ...p, x, y };
        });
      });
    };
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition);
      window.removeEventListener("resize", reposition);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [screenPointFor]);

  // Unmounting mid-hover (a route change, say) would otherwise strand the
  // global cursor hidden.
  useEffect(
    () => () => {
      window.dispatchEvent(new CustomEvent("nbil:cursor-merge", { detail: { active: false } }));
    },
    [],
  );

  const activeState = popup
    ? INDIA_STATE_PATHS.find((s) => s.id === popup.stateId)
    : null;
  const activeInstallations = activeState ? getStateInstallations(activeState.id) : [];

  return (
    <section
      id="installations"
      aria-labelledby="installations-heading"
      className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center lg:mb-16">
          <span className="eyebrow text-[var(--color-brand-strong)]">
            Where Trivima works
          </span>
          <h2
            id="installations-heading"
            className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[2.75rem]"
          >
            {TOTAL_INSTALLATIONS}+ installations across {installedCount} states
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            Hover or tap a state to see who&rsquo;s bioprinting there.
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl">
          <svg
            ref={svgRef}
            viewBox={INDIA_MAP_VIEWBOX}
            className="h-auto w-full"
            role="group"
            aria-label="Map of India showing Trivima installations by state"
          >
            {INDIA_STATE_PATHS.map((s) => {
              const installed = INSTALLED_STATE_IDS.has(s.id);
              const active = popup?.stateId === s.id;
              const count = installed ? getStateInstallations(s.id).length : 0;
              return (
                <path
                  key={s.id}
                  data-state-path
                  {...(installed ? { "data-cursor-merge": "" } : {})}
                  d={s.d}
                  tabIndex={installed ? 0 : -1}
                  role={installed ? "button" : undefined}
                  aria-label={
                    installed
                      ? `${s.name}: ${count} installation${count === 1 ? "" : "s"}`
                      : undefined
                  }
                  aria-expanded={installed ? active : undefined}
                  onPointerEnter={() => handleEnter(s.id, s.cx, s.cy)}
                  onPointerLeave={handleLeave}
                  onClick={() => handleClick(s.id, s.cx, s.cy)}
                  onFocus={() => handleEnter(s.id, s.cx, s.cy)}
                  onBlur={handleLeave}
                  onKeyDown={(e) => handleKeyDown(e, s.id, s.cx, s.cy)}
                  className={[
                    "outline-none transition-[fill,stroke-width,filter] duration-300 ease-out",
                    installed ? "cursor-none" : "",
                  ].join(" ")}
                  style={{
                    fill: installed
                      ? active
                        ? "rgba(37,114,253,0.65)"
                        : "rgba(37,114,253,0.22)"
                      : "var(--color-surface-raised)",
                    stroke: installed
                      ? active
                        ? "#2572fd"
                        : "rgba(37,114,253,0.5)"
                      : "var(--color-hairline)",
                    strokeWidth: installed && active ? 2.5 : 1,
                    strokeLinejoin: "round",
                    filter: active
                      ? "drop-shadow(0 0 10px rgba(37,114,253,0.55))"
                      : "none",
                  }}
                />
              );
            })}
          </svg>

          <AnimatePresence>
            {popup && activeState && (
              // The anchor offset rides on the CSS `translate` property
              // rather than `transform`, which Motion owns for the scale/y
              // below. That keeps the card a single motion element and a
              // direct child of AnimatePresence, which is what lets the exit
              // animation run at all: with a plain wrapper in between, the
              // card vanished instantly instead of animating out.
              //
              // A hover card is inert (`pointer-events-none`). It overlaps the
              // map, so a card that could take the pointer pulled it off the
              // state underneath, which closed the card, which handed the
              // pointer back: the flicker loop that made hovering feel
              // unreliable. A pinned card stays interactive for its close
              // button and its scrollbar.
              <motion.div
                key={popup.stateId}
                data-installations-popup
                initial={reduce ? false : { opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.18, ease: EASE }}
                style={{
                  position: "fixed",
                  left: popup.x,
                  top: popup.y,
                  translate: "-50% calc(-100% - 14px)",
                  width: POPUP_W,
                  pointerEvents: popup.pinned ? "auto" : "none",
                }}
                className="z-50 max-h-[min(60vh,380px)] overflow-y-auto rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 shadow-[0_20px_50px_rgba(2,12,27,0.28)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      weight="fill"
                      className="text-[var(--color-brand)]"
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-[15px] font-semibold text-[var(--color-ink)]">
                      {activeState.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPopup(null)}
                    aria-label="Close"
                    className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)]"
                  >
                    <X size={13} weight="bold" />
                  </button>
                </div>
                <ul className="mt-3 flex flex-col gap-2.5" role="list">
                  {activeInstallations.map((inst) => (
                    <li
                      key={`${inst.name}-${inst.city ?? ""}`}
                      className="border-t border-[var(--color-hairline)] pt-2.5 first:border-t-0 first:pt-0"
                    >
                      <p className="text-[13.5px] font-medium leading-snug text-[var(--color-ink)]">
                        {inst.name}
                        {inst.city ? (
                          <span className="font-normal text-[var(--color-ink-faint)]">
                            {" "}
                            &middot; {inst.city}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--color-brand-strong)]">
                        {inst.model}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {INTERNATIONAL_INSTALLATIONS.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
              International
            </span>
            {INTERNATIONAL_INSTALLATIONS.map((inst) => (
              <span
                key={inst.name}
                className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface-raised)] px-3 py-1 text-[13px] text-[var(--color-ink-muted)]"
              >
                {inst.name}
                {inst.city ? `, ${inst.city}` : ""} &middot; {inst.model}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
