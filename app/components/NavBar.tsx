"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LiquidGlass } from "@/components/ui/liquid-glass";

const NAV_LINKS = [
  { label: "Bioprinters", href: "/trivima" },
  { label: "Our story", href: "/#story" },
  { label: "Products", href: "/#products" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/#connect" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3">
      <div className="max-w-7xl mx-auto">
        <LiquidGlass
          distort={false}
          tint="light"
          className={[
            "rounded-2xl border border-white/50 transition-shadow duration-300",
            "bg-[var(--color-surface)]/45",
            scrolled
              ? "shadow-[0_10px_34px_rgba(2,12,27,0.14)]"
              : "shadow-[0_4px_18px_rgba(2,12,27,0.06)]",
          ].join(" ")}
        >
          <div className="h-[58px] pl-5 pr-3 flex items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/"
              className="flex items-center shrink-0"
              aria-label="Next Big Innovation Labs — home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/recognition/nbil-logo.png"
                alt="Next Big Innovation Labs"
                className="h-7 w-auto"
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile trigger */}
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild className="hidden md:inline-flex h-9 px-5 rounded-xl text-[14px]">
                <Link href="/#connect">Get in touch</Link>
              </Button>
              <button
                className="md:hidden p-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors rounded-lg cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
              </button>
            </div>
          </div>
        </LiquidGlass>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-2"
            >
              <LiquidGlass
                distort={false}
                tint="light"
                className="rounded-2xl border border-white/50 bg-[var(--color-surface)]/70 shadow-[0_12px_34px_rgba(2,12,27,0.16)]"
              >
                <div className="px-5 pb-5 pt-3 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[16px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors py-2.5 border-b border-[var(--color-hairline-subtle)] last:border-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button asChild className="mt-3 h-12 rounded-xl text-[15px]">
                    <Link href="/#connect" onClick={() => setMobileOpen(false)}>
                      Get in touch
                    </Link>
                  </Button>
                </div>
              </LiquidGlass>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
