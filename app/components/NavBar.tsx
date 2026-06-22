"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Bioprinters", href: "/trivima" },
  { label: "Our story", href: "/#story" },
  { label: "Products", href: "/#products" },
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
    <header
      role="banner"
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-hairline)]"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
      style={{ height: "68px" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="Next Big Innovation Labs — home"
        >
          <span className="text-[15px] font-bold text-[var(--color-ink)] tracking-tight font-display">
            NBIL
          </span>
          <span className="w-px h-4 bg-[var(--color-hairline)]" aria-hidden="true" />
          <span className="hidden sm:inline text-[13px] font-medium text-[var(--color-ink-muted)] tracking-tight">
            Next Big Innovation Labs
          </span>
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
        <div className="flex items-center gap-3 shrink-0">
          <Button asChild className="hidden md:inline-flex h-10 px-5 rounded-xl text-[14px]">
            <Link href="/#connect">Get in touch</Link>
          </Button>
          <button
            className="md:hidden p-2 -mr-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors rounded-lg cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-surface)] border-b border-[var(--color-hairline)] px-6 pb-6 pt-4 flex flex-col gap-3"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[16px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors py-2 border-b border-[var(--color-hairline-subtle)] last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 h-12 rounded-xl text-[15px]">
              <Link href="/#connect" onClick={() => setMobileOpen(false)}>
                Get in touch
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
