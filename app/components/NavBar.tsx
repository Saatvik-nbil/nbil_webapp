"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X, CaretDown } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";
import { LiquidGlass } from "@/components/ui/liquid-glass";

type NavChild = {
  label: string;
  href?: string;
  external?: boolean;
  comingSoon?: boolean;
};
type NavItem = {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Products",
    children: [
      { label: "Bioprinters", href: "/trivima" },
      { label: "Software", href: "/dhee-slicer" },
      { label: "Consumables", comingSoon: true },
    ],
  },
  { label: "Consultancy", href: "/consultancy" },
  {
    label: "Resources",
    children: [
      { label: "Next Big Blogs", href: "/blogs" },
      { label: "Publications", href: "/publications" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    label: "About Us",
    children: [
      { label: "Our Story", href: "/our-story" },
      { label: "Teams & Career", href: "/team" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/#connect" },
    ],
  },
];

const extAttrs = (external?: boolean) =>
  external ? { target: "_blank", rel: "noopener noreferrer" } : {};

function ComingSoonBadge() {
  return (
    <span className="ml-2 rounded-md bg-[var(--color-surface-raised)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-ink-faint)]">
      Soon
    </span>
  );
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuRect, setMenuRect] = useState<{ left: number; bottom: number; width: number } | null>(null);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  const openMenuAt = (label: string, el: HTMLElement | null) => {
    setOpenMenu(label);
    if (el) {
      const r = el.getBoundingClientRect();
      setMenuRect({ left: r.left, bottom: r.bottom, width: r.width });
    }
  };

  /* Which stretches of a page are dark is a property of the page, not of this
     bar, so sections declare it with data-nav-theme="dark" and the bar reads
     whatever currently sits under it. Photo heroes are the case that forced
     this: light glass and a navy wordmark both vanish against them. Re-runs on
     navigation because the header stays mounted across routes. */
  useEffect(() => {
    /* Probed a little below the top of the viewport, inside the bar itself
       rather than at its edge, so a section boundary flips the theme as it
       passes behind the bar and not before it arrives. */
    const PROBE = 46;
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      let dark = false;
      document
        .querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')
        .forEach((zone) => {
          const rect = zone.getBoundingClientRect();
          if (rect.top <= PROBE && rect.bottom >= PROBE) dark = true;
        });
      setOverDark(dark);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    /* Scroll and resize alone left the bar stuck on the wrong theme: a hero
       image or web font landing after mount moves every dark zone without
       either event firing, and on phones that is the common case. Watching
       the document's own box catches those reflows. */
    const ro = new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    window.addEventListener("load", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  /* Route changes close the sheet: the header survives navigation, so without
     this a tap on a link that only changes the hash leaves it hanging open. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* While the sheet is open the page behind it must not move. Lenis drives
     scrolling on this site, so stopping it is what actually holds the page;
     the overflow lock covers the reduced-motion case where Lenis never
     mounted. Escape closes, as it does for the desktop dropdowns. */
  useEffect(() => {
    if (!mobileOpen) return;
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    /* Flags the page so the floating controls stand down: the chat launcher
       and the sticky CTA both outrank this header's z-index and were sitting
       on top of the open sheet. See globals.css. */
    document.documentElement.dataset.navOpen = "true";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      delete document.documentElement.dataset.navOpen;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  /* One class pair, reused by the dropdown triggers, the plain links and the
     mobile toggle so they never drift apart. */
  const navItemClass = overDark
    ? "text-white/80 hover:text-white"
    : "text-[var(--color-ink-muted)] hover:text-[var(--color-brand-strong)]";

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4"
      style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
    >
      <div className="max-w-7xl mx-auto">
        <LiquidGlass
          distort={false}
          tint={overDark ? "dark" : "light"}
          className={[
            "rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300",
            overDark
              ? "border-white/15 bg-[#0c1626]/55"
              : "border-white/50 bg-[var(--color-surface)]/45",
            scrolled
              ? "shadow-[0_10px_34px_rgba(2,12,27,0.14)]"
              : "shadow-[0_4px_18px_rgba(2,12,27,0.06)]",
          ].join(" ")}
        >
          <div className="h-[58px] pl-5 pr-3 flex items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/"
              className="group flex items-center shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
              aria-label="Next Big Innovation Labs, home"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/recognition/nbil-logo.png"
                alt="Next Big Innovation Labs"
                className={[
                  "h-7 w-auto origin-left will-change-[scale,filter]",
                  // Tailwind v4 compiles scale-* to the standalone `scale`
                  // property, not `transform`: transition that, or it snaps.
                  // The transparent base shadow gives the glow something to
                  // interpolate from; filter:none is not animatable.
                  "drop-shadow-[0_0_0_rgba(37,114,253,0)]",
                  "transition-[scale,filter] duration-700 ease-in-out",
                  overDark ? "brightness-0 invert" : "",
                  "group-hover:scale-[1.05] group-hover:drop-shadow-[0_2px_12px_rgba(37,114,253,0.38)]",
                  "group-active:scale-[0.985] group-active:duration-200",
                  "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100",
                ].join(" ")}
              />
            </Link>

            {/* Right-aligned navigation + CTA + mobile trigger */}
            <div className="flex items-center gap-6 shrink-0">
              <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                {NAV_ITEMS.map((item) =>
                  item.children ? (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={(e) =>
                        openMenuAt(item.label, e.currentTarget.querySelector("button"))
                      }
                      onMouseLeave={() => setOpenMenu(null)}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node))
                          setOpenMenu(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setOpenMenu(null);
                      }}
                    >
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={openMenu === item.label}
                        onClick={(e) =>
                          openMenu === item.label
                            ? setOpenMenu(null)
                            : openMenuAt(item.label, e.currentTarget)
                        }
                        onFocus={(e) => openMenuAt(item.label, e.currentTarget)}
                        className={`flex items-center gap-1 text-[14px] ${navItemClass} transition-colors duration-150 whitespace-nowrap cursor-pointer`}
                      >
                        {item.label}
                        <CaretDown
                          size={12}
                          weight="bold"
                          className={`transition-transform duration-200 ${
                            openMenu === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openMenu === item.label && menuRect && (
                          <motion.div
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                              position: "fixed",
                              top: menuRect.bottom,
                              left: menuRect.left + menuRect.width / 2,
                              transform: "translateX(-50%)",
                            }}
                            className="z-50 pt-3"
                          >
                            <div className="min-w-[220px] rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-2 shadow-[0_16px_44px_rgba(2,12,27,0.16)]">
                              {item.children.map((child) =>
                                child.comingSoon || !child.href ? (
                                  <span
                                    key={child.label}
                                    aria-disabled="true"
                                    className="flex cursor-default items-center rounded-lg px-3 py-2 text-[14px] text-[var(--color-ink-faint)]"
                                  >
                                    {child.label}
                                    <ComingSoonBadge />
                                  </span>
                                ) : (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    {...extAttrs(child.external)}
                                    onClick={() => setOpenMenu(null)}
                                    className="flex items-center rounded-lg px-3 py-2 text-[14px] text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-brand-strong)]"
                                  >
                                    {child.label}
                                  </Link>
                                ),
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href ?? "#"}
                      {...extAttrs(item.external)}
                      className={`text-[14px] ${navItemClass} transition-colors duration-150 whitespace-nowrap`}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
              <OriginButton
                href="/#connect"
                className="hidden md:inline-flex h-9 px-5 text-[14px]"
              >
                Get in touch
              </OriginButton>
              <button
                className={`md:hidden rounded-lg p-2 ${navItemClass} transition-colors cursor-pointer`}
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
              className="relative z-10 md:hidden mt-2"
            >
              <LiquidGlass
                distort={false}
                tint="light"
                className="rounded-2xl border border-white/50 bg-[var(--color-surface)]/80 shadow-[0_12px_34px_rgba(2,12,27,0.16)]"
              >
                <div
                  data-lenis-prevent
                  className="flex max-h-[calc(100svh-8.5rem)] flex-col overflow-y-auto overscroll-contain px-4 pb-4 pt-2"
                >
                  {NAV_ITEMS.map((item) =>
                    item.children ? (
                      <details
                        key={item.label}
                        className="group border-b border-[var(--color-hairline-subtle)]"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[16px] text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">
                          {item.label}
                          <CaretDown
                            size={16}
                            weight="bold"
                            className="text-[var(--color-ink-faint)] transition-transform duration-200 group-open:rotate-180"
                          />
                        </summary>
                        <div className="flex flex-col pb-2">
                          {item.children.map((child) =>
                            child.comingSoon || !child.href ? (
                              <span
                                key={child.label}
                                aria-disabled="true"
                                className="flex items-center py-2 pl-3 text-[15px] text-[var(--color-ink-faint)]"
                              >
                                {child.label}
                                <ComingSoonBadge />
                              </span>
                            ) : (
                              <Link
                                key={child.label}
                                href={child.href}
                                {...extAttrs(child.external)}
                                onClick={closeMobile}
                                className="py-2 pl-3 text-[15px] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-brand-strong)]"
                              >
                                {child.label}
                              </Link>
                            ),
                          )}
                        </div>
                      </details>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href ?? "#"}
                        {...extAttrs(item.external)}
                        onClick={closeMobile}
                        className="border-b border-[var(--color-hairline-subtle)] py-3 text-[16px] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-brand-strong)]"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                  <OriginButton
                    href="/#connect"
                    onClick={closeMobile}
                    className="mt-4 h-12 w-full text-[15px]"
                  >
                    Get in touch
                  </OriginButton>
                </div>
              </LiquidGlass>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tap-anywhere-else to close. Sits under the sheet but over the page,
          and is the reason the sheet above carries its own stacking context. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={closeMobile}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 -z-10 cursor-default bg-[#0c1626]/25 md:hidden"
          />
        )}
      </AnimatePresence>
    </header>
  );
}
