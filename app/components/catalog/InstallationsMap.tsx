"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MapPin, X } from "@phosphor-icons/react";
import { INDIA_STATE_PATHS, INDIA_MAP_VIEWBOX } from "@/lib/india-map-paths";
import {
  getStateInstallations,
  INSTALLED_STATE_IDS,
  INTERNATIONAL_INSTALLATIONS,
  TOTAL_INSTALLATIONS,
} from "@/lib/installations";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * States whose outline is too small to hover reliably, so they also get a
 * marker sitting on top of the map. Delhi is a dozen SVG units across and
 * carries three installations, which made it the one state on the map nobody
 * could find.
 */
const PINNED_STATES = new Set(["delhi"]);

/** What the panel reads before anyone touches the map. Delhi carries three
 *  installations and is the hardest state to find, so it is the one worth
 *  showing by default. */
const DEFAULT_STATE = "delhi";

type Active = { stateId: string; pinned: boolean };

/**
 * Interactive India map on /trivima: hover (or tap) a state that has a
 * Trivima installation to see who's running one there. The detail reads in a
 * panel beside the map rather than a card floating over it, so the map is
 * never covered by the thing describing it.
 *
 * Hovering an installed state dispatches `nbil:cursor-merge` so the site's
 * replacement cursor (coordinate-cursor.tsx) hides itself: the state's own
 * glowing outline becomes the pointer feedback instead of the two
 * overlapping.
 */
export default function InstallationsMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Active | null>(null);

  const installedCount = INSTALLED_STATE_IDS.size;

  function handleEnter(stateId: string) {
    if (!INSTALLED_STATE_IDS.has(stateId)) return;
    window.dispatchEvent(new CustomEvent("nbil:cursor-merge", { detail: { active: true } }));
    setActive({ stateId, pinned: false });
  }

  function handleLeave() {
    window.dispatchEvent(new CustomEvent("nbil:cursor-merge", { detail: { active: false } }));
    setActive((a) => (a?.pinned ? a : null));
  }

  function handleClick(stateId: string) {
    if (!INSTALLED_STATE_IDS.has(stateId)) return;
    setActive({ stateId, pinned: true });
  }

  function handleKeyDown(e: React.KeyboardEvent, stateId: string) {
    if (!INSTALLED_STATE_IDS.has(stateId)) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive({ stateId, pinned: true });
    }
    if (e.key === "Escape") setActive(null);
  }

  // Dismiss a pinned selection on Escape or an outside click.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    function onPointerDown(e: PointerEvent) {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-installations-panel]") && !el.closest("[data-state-path]")) {
        setActive(null);
      }
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  // Unmounting mid-hover (a route change, say) would otherwise strand the
  // global cursor hidden.
  useEffect(
    () => () => {
      window.dispatchEvent(new CustomEvent("nbil:cursor-merge", { detail: { active: false } }));
    },
    [],
  );

  /* The panel always has something to say: the reader's own choice, or Delhi
     until they make one. */
  const shownId = active?.stateId ?? DEFAULT_STATE;
  const shownState = INDIA_STATE_PATHS.find((s) => s.id === shownId) ?? null;
  const shownInstallations = shownState ? getStateInstallations(shownState.id) : [];

  return (
    <section
      id="installations"
      aria-labelledby="installations-heading"
      className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center lg:mb-16">
          <h2
            id="installations-heading"
            className="h2"
          >
            {TOTAL_INSTALLATIONS}+ installations across {installedCount} states
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            Hover or tap a state to see who&rsquo;s bioprinting there.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <svg
              viewBox={INDIA_MAP_VIEWBOX}
              className="mx-auto h-auto w-full max-w-2xl"
              role="group"
              aria-label="Map of India showing Trivima installations by state"
            >
              {INDIA_STATE_PATHS.map((s) => {
                const installed = INSTALLED_STATE_IDS.has(s.id);
                const isActive = shownId === s.id;
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
                    aria-expanded={installed ? isActive : undefined}
                    onPointerEnter={() => handleEnter(s.id)}
                    onPointerLeave={handleLeave}
                    onClick={() => handleClick(s.id)}
                    onFocus={() => handleEnter(s.id)}
                    onBlur={handleLeave}
                    onKeyDown={(e) => handleKeyDown(e, s.id)}
                    className={[
                      "outline-none transition-[fill,stroke-width,filter] duration-300 ease-out",
                      installed ? "cursor-none" : "",
                    ].join(" ")}
                    style={{
                      fill: installed
                        ? isActive
                          ? "rgba(37,114,253,0.65)"
                          : "rgba(37,114,253,0.22)"
                        : "var(--color-surface-raised)",
                      stroke: installed
                        ? isActive
                          ? "#2572fd"
                          : "rgba(37,114,253,0.5)"
                        : "var(--color-hairline)",
                      strokeWidth: installed && isActive ? 2.5 : 1,
                      strokeLinejoin: "round",
                      filter: isActive
                        ? "drop-shadow(0 0 10px rgba(37,114,253,0.55))"
                        : "none",
                    }}
                  />
                );
              })}

              {/* Markers for the states too small to hover. Drawn after every
                  path so they sit on top, with a hit circle wider than the
                  dot itself. */}
              {INDIA_STATE_PATHS.filter(
                (s) => PINNED_STATES.has(s.id) && INSTALLED_STATE_IDS.has(s.id),
              ).map((s) => {
                const isActive = shownId === s.id;
                const count = getStateInstallations(s.id).length;
                return (
                  <g
                    key={`pin-${s.id}`}
                    data-state-path
                    data-cursor-merge=""
                    tabIndex={0}
                    role="button"
                    aria-label={`${s.name}: ${count} installation${count === 1 ? "" : "s"}`}
                    aria-expanded={isActive}
                    onPointerEnter={() => handleEnter(s.id)}
                    onPointerLeave={handleLeave}
                    onClick={() => handleClick(s.id)}
                    onFocus={() => handleEnter(s.id)}
                    onBlur={handleLeave}
                    onKeyDown={(e) => handleKeyDown(e, s.id)}
                    className="cursor-none outline-none"
                  >
                    <circle cx={s.cx} cy={s.cy} r={11} fill="transparent" />
                    <circle
                      cx={s.cx}
                      cy={s.cy}
                      r={isActive ? 5.5 : 4}
                      fill="#2572fd"
                      stroke="var(--color-surface)"
                      strokeWidth={1.5}
                      style={{
                        transition: "r 300ms ease-out",
                        filter: isActive
                          ? "drop-shadow(0 0 8px rgba(37,114,253,0.8))"
                          : "none",
                      }}
                    />
                    <text
                      x={s.cx + 10}
                      y={s.cy + 3.5}
                      className="font-display"
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        fill: isActive ? "#1d4ed8" : "var(--color-ink-muted)",
                        paintOrder: "stroke",
                        stroke: "var(--color-surface)",
                        strokeWidth: 2.5,
                        strokeLinejoin: "round",
                      }}
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail reads beside the map, not over it. */}
          <aside className="lg:col-span-5" data-installations-panel>
            <div className="flex flex-col gap-5 lg:sticky lg:top-28">
              <div className="min-h-[13rem] rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5">
                <AnimatePresence mode="wait" initial={false}>
                  {shownState ? (
                    <motion.div
                      key={shownState.id}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: EASE }}
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
                            {shownState.name}
                          </h3>
                        </div>
                        {active?.pinned ? (
                          <button
                            type="button"
                            onClick={() => setActive(null)}
                            aria-label="Close"
                            className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)]"
                          >
                            <X size={13} weight="bold" />
                          </button>
                        ) : null}
                      </div>
                      <ul className="mt-3 flex flex-col gap-2.5" role="list">
                        {shownInstallations.map((inst) => (
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
                  ) : null}
                </AnimatePresence>
              </div>

              {INTERNATIONAL_INSTALLATIONS.length > 0 && (
                <div className="rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-subtle)] p-5">
                  <h3 className="font-display text-[15px] font-semibold text-[var(--color-ink)]">
                    Beyond India
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2.5" role="list">
                    {INTERNATIONAL_INSTALLATIONS.map((inst) => (
                      <li
                        key={inst.name}
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
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
