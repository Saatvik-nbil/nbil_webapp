import type { FC } from "react";
import Link from "next/link";
import { COMPANY } from "@/lib/machines";
import MagneticDock from "@/components/ui/magnetic-dock";

const NAV_PRIMARY = [
  { label: "Home", href: "/" },
  { label: "Bioprinters", href: "/trivima" },
  { label: "Consultancy", href: "/consultancy" },
  { label: "Our Story", href: "/our-story" },
  { label: "Team", href: "/team" },
];

const NAV_SECONDARY = [
  { label: "News", href: "/news" },
  { label: "Blog", href: "/blogs" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#connect" },
];

const Footer: FC = () => (
  <footer
    role="contentinfo"
    className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)]"
  >
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 lg:pt-14">
      {/* Main content: wordmark + nav + locations stacked on the left,
          follow / gradient / tagline spread down the right column so the
          whole footer stays compact within one viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-stretch">
        {/* Left: wordmark, navigation, locations */}
        <div className="flex flex-col gap-8 min-w-0">
          {/* Wordmark */}
          <span
            className="block font-display font-bold tracking-[-0.045em] leading-[0.8] text-[var(--color-ink)] select-none whitespace-nowrap"
            style={{ fontSize: "clamp(2.75rem, 11.5vw, 9rem)" }}
          >
            nbil
            <sup className="align-super text-[0.16em] font-normal tracking-normal ml-[0.06em] top-0">
              &reg;
            </sup>
          </span>

          {/* Navigation */}
          <div className="flex flex-col gap-5">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">
              Navigation
            </p>
            <div className="flex gap-x-14">
              <nav aria-label="Footer navigation, primary">
                <ul className="flex flex-col gap-3" role="list">
                  {NAV_PRIMARY.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-[var(--color-brand-strong)] hover:text-[var(--color-ink)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Footer navigation, secondary">
                <ul className="flex flex-col gap-3" role="list">
                  {NAV_SECONDARY.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-[var(--color-brand-strong)] hover:text-[var(--color-ink)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Locations */}
          <div className="flex flex-col gap-5">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">
              Locations
            </p>
            <div className="flex items-center gap-6">
              {/* Vidhana Soudha — Bengaluru landmark silhouette */}
              <svg
                viewBox="0 0 140 100"
                aria-hidden="true"
                className="h-[68px] w-auto shrink-0 text-[var(--color-ink)]"
                fill="currentColor"
              >
                {/* central onion dome + finial */}
                <rect x="69" y="6" width="2" height="8" />
                <circle cx="70" cy="5" r="2.2" />
                <path d="M56 37 C56 24 62 15 70 15 C78 15 84 24 84 37 Z" />
                <rect x="58" y="36" width="24" height="12" />
                {/* flanking corner domes + finials */}
                <rect x="36.2" y="23" width="1.6" height="6" />
                <circle cx="37" cy="22" r="1.6" />
                <path d="M28 41 C28 33 32 28 37 28 C42 28 46 33 46 41 Z" />
                <rect x="30" y="40" width="14" height="6" />
                <rect x="102.2" y="23" width="1.6" height="6" />
                <circle cx="103" cy="22" r="1.6" />
                <path d="M94 41 C94 33 98 28 103 28 C108 28 112 33 112 41 Z" />
                <rect x="96" y="40" width="14" height="6" />
                {/* entablature */}
                <rect x="26" y="46" width="88" height="6" />
                {/* colonnade */}
                <rect x="30" y="52" width="5" height="22" />
                <rect x="41" y="52" width="5" height="22" />
                <rect x="52" y="52" width="5" height="22" />
                <rect x="63" y="52" width="5" height="22" />
                <rect x="74" y="52" width="5" height="22" />
                <rect x="85" y="52" width="5" height="22" />
                <rect x="96" y="52" width="5" height="22" />
                <rect x="105" y="52" width="5" height="22" />
                {/* plinth + steps */}
                <rect x="22" y="74" width="96" height="8" />
                <rect x="12" y="82" width="116" height="8" />
                <rect x="2" y="90" width="136" height="8" />
              </svg>
              <address className="not-italic text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--color-ink)]">
                  {COMPANY.short}
                </span>
                <br />
                {COMPANY.address.line1}
                <br />
                {COMPANY.address.line2}
                <br />
                {COMPANY.address.city}, {COMPANY.address.country}
              </address>
            </div>
          </div>
        </div>

        {/* Right: follow us (above the line) + gradient + tagline lockup,
            grouped together and vertically centered against the left column */}
        <div className="flex flex-col gap-8 lg:justify-center lg:items-end lg:py-1">
          {/* Follow Us */}
          <div className="flex flex-col gap-5 lg:items-end">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">
              Follow Us
            </p>
            <MagneticDock />
          </div>

          {/* Gradient bar echoing the nbil mark palette */}
          <div
            aria-hidden="true"
            className="h-1.5 w-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #f6a723 0%, #d6156a 34%, #7b2ff0 60%, #2d81e4 100%)",
            }}
          />

          {/* Tagline lockup */}
          <div className="flex items-center gap-5 lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/recognition/nbil-logo.png"
              alt={COMPANY.name}
              className="h-11 w-auto"
            />
            <p className="font-display font-semibold tracking-[-0.02em] leading-[0.98] text-[var(--color-ink)] text-[clamp(1.7rem,3vw,2.5rem)]">
              Bioprinting for
              <br />a better future.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-14 pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
          Copyright &copy;{new Date().getFullYear()} {COMPANY.short} — All rights reserved
        </p>
        <Link
          href="/privacy-policy"
          className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
        >
          Privacy Policy
        </Link>
        <a
          href={COMPANY.site}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
        >
          {COMPANY.name}
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
