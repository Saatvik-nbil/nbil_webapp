"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { LiquidLink, LiquidGlassFilter } from "@/components/ui/liquid-glass-button";

const NAV_LINKS = [
  { label: "Models",  href: "/#models"   },
  { label: "Compare", href: "/#compare"  },
  { label: "Software",href: "/#software" },
  { label: "Contact", href: "/#contact"  },
];

/* ─── Thin highlight rule used at top of glass surfaces ─────────────── */
const GlossRule = () => (
  <span
    className="pointer-events-none absolute inset-x-[5%] top-0 h-px rounded-full"
    style={{
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.80) 30%, rgba(255,255,255,0.80) 70%, transparent)",
    }}
    aria-hidden="true"
  />
);

/* ─── Nav link with glass pill hover ────────────────────────────────── */
function NavPill({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative inline-flex h-[30px] items-center rounded-full px-[14px] text-[13.5px] font-medium transition-colors duration-150"
      style={{ color: "var(--color-ink-muted)" }}
    >
      {/* hover pill */}
      <span
        className="absolute inset-0 scale-[0.88] rounded-full opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
        style={{
          background: "rgba(109,40,217,0.07)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "1px solid rgba(109,40,217,0.13)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
        aria-hidden="true"
      />
      <span
        className="relative transition-colors duration-150 group-hover:text-[var(--color-ink)]"
        style={{ zIndex: 1 }}
      >
        {label}
      </span>
    </Link>
  );
}

/* ─── Main floating-pill glass NavBar ───────────────────────────────── */
export default function NavBar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const EASE = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      {/* shared SVG filter — renders invisible, only defines filter */}
      <LiquidGlassFilter id="nav-glass" />

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP: floating centered pill
          ════════════════════════════════════════════════════════════════ */}
      <header role="banner" className="fixed inset-x-0 top-4 z-50 hidden md:flex justify-center pointer-events-none">
        <motion.div
          initial={false}
          animate={{
            y:      scrolled ? 0  : 0,
            scale:  scrolled ? 1  : 1,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className="pointer-events-auto relative flex items-center gap-1 rounded-full px-2 py-1.5"
          style={{
            /* ── glass body ── */
            backdropFilter:       "blur(28px) saturate(200%) brightness(1.04)",
            WebkitBackdropFilter: "blur(28px) saturate(200%) brightness(1.04)",
            background: scrolled
              ? "linear-gradient(180deg, rgba(248,247,255,0.82) 0%, rgba(244,240,255,0.72) 100%)"
              : "linear-gradient(180deg, rgba(248,247,255,0.60) 0%, rgba(244,240,255,0.48) 100%)",
            /* ── bevel + shadow ── */
            boxShadow: scrolled
              ? [
                  "inset 0 1.5px 0 rgba(255,255,255,0.90)",
                  "inset 0 -1px 0 rgba(109,40,217,0.08)",
                  "inset 1px 0 0 rgba(255,255,255,0.60)",
                  "inset -1px 0 0 rgba(109,40,217,0.06)",
                  "0 0 0 1px rgba(109,40,217,0.13)",
                  "0 8px 40px rgba(17,8,32,0.12)",
                  "0 2px 8px rgba(17,8,32,0.07)",
                ].join(", ")
              : [
                  "inset 0 1px 0 rgba(255,255,255,0.70)",
                  "0 0 0 1px rgba(109,40,217,0.09)",
                  "0 4px 20px rgba(17,8,32,0.08)",
                ].join(", "),
            transition: "background 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          <GlossRule />

          {/* Wordmark */}
          <Link
            href="/"
            aria-label="Trivima — home"
            className="group flex items-center gap-2 rounded-full px-3 py-1 transition-colors duration-150"
          >
            <span className="text-[15px] font-bold tracking-tight font-display text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors duration-150">
              Trivima
            </span>
            <span
              className="h-3.5 w-px rounded-full"
              style={{ background: "rgba(109,40,217,0.22)" }}
              aria-hidden="true"
            />
            <span className="text-[11.5px] font-medium text-[var(--color-ink-muted)] tracking-tight">
              by NBIL
            </span>
          </Link>

          {/* divider */}
          <span
            className="h-5 w-px rounded-full mx-0.5"
            style={{ background: "rgba(109,40,217,0.14)" }}
            aria-hidden="true"
          />

          {/* Nav links */}
          <nav className="flex items-center gap-0" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavPill key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* divider */}
          <span
            className="h-5 w-px rounded-full mx-0.5"
            style={{ background: "rgba(109,40,217,0.14)" }}
            aria-hidden="true"
          />

          {/* CTA */}
          <LiquidLink
            size="sm"
            variant="primary"
            href="/#contact"
            className=""
          >
            Request a Quote
          </LiquidLink>
        </motion.div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE: top bar
          ════════════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        className="fixed inset-x-0 top-0 z-50 md:hidden"
        style={{ height: "60px" }}
      >
        {/* glass bg */}
        <motion.div
          initial={false}
          animate={{ opacity: scrolled || mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(24px) saturate(200%) brightness(1.04)",
              WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(1.04)",
              background:
                "linear-gradient(180deg, rgba(248,247,255,0.82) 0%, rgba(244,240,255,0.70) 100%)",
              boxShadow:
                "inset 0 -1px 0 rgba(109,40,217,0.10), 0 2px 16px rgba(17,8,32,0.06)",
            }}
          />
          <GlossRule />
        </motion.div>

        <div className="relative z-10 flex items-center justify-between h-full px-4">
          <Link href="/" aria-label="Trivima — home" className="flex items-center gap-2 group">
            <span className="text-[15px] font-bold tracking-tight font-display text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors">
              Trivima
            </span>
            <span className="h-3.5 w-px rounded-full" style={{ background: "rgba(109,40,217,0.22)" }} aria-hidden="true" />
            <span className="text-[11.5px] font-medium text-[var(--color-ink-muted)]">by NBIL</span>
          </Link>

          <button
            className="flex size-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer active:scale-90"
            style={{
              background: mobileOpen ? "rgba(109,40,217,0.10)" : "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(109,40,217,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 4px rgba(0,0,0,0.08)",
              color: "var(--color-ink-muted)",
            }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <X size={17} weight="bold" />
                </motion.span>
              ) : (
                <motion.span
                  key="list"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <List size={17} weight="bold" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE DROPDOWN PANEL
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed top-[68px] left-3 right-3 z-40 overflow-hidden rounded-[22px] md:hidden"
            style={{
              backdropFilter: "blur(36px) saturate(220%) brightness(1.06)",
              WebkitBackdropFilter: "blur(36px) saturate(220%) brightness(1.06)",
              background:
                "linear-gradient(160deg, rgba(248,247,255,0.94) 0%, rgba(240,236,255,0.90) 100%)",
              boxShadow: [
                "inset 0 1.5px 0 rgba(255,255,255,0.90)",
                "inset 0 -1px 0 rgba(109,40,217,0.08)",
                "0 0 0 1px rgba(109,40,217,0.13)",
                "0 12px 60px rgba(17,8,32,0.14)",
                "0 3px 12px rgba(17,8,32,0.07)",
              ].join(", "),
            }}
          >
            {/* top gloss */}
            <span
              className="pointer-events-none absolute inset-x-[8%] top-0 h-[44%] rounded-b-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0) 100%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 p-3 flex flex-col gap-0.5">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.045,
                    duration: 0.22,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center h-12 px-4 rounded-[14px] text-[15px] font-medium transition-all duration-150 active:scale-[0.98]"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    <span className="transition-colors duration-150 group-hover:text-[var(--color-ink)]">
                      {link.label}
                    </span>
                    <span
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[var(--color-brand)]"
                      style={{ fontSize: "10px" }}
                    >
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.045 + 0.04, duration: 0.22 }}
                className="pt-2 mt-1"
                style={{ borderTop: "1px solid rgba(109,40,217,0.09)" }}
              >
                <LiquidLink
                  size="lg"
                  variant="primary"
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="w-full"
                >
                  Request a Quote
                </LiquidLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* backdrop dim */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(17,8,32,0.08)", backdropFilter: "blur(2px)" }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
