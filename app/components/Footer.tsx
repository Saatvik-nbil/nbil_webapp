import type { FC } from "react";
import Link from "next/link";
import { COMPANY } from "@/lib/machines";
import MagneticDock from "@/components/ui/magnetic-dock";
import { CompanyName } from "@/app/components/CompanyName";

const QUICK_LINKS = [
  { label: "Trivima Bioprinters", href: "/trivima" },
  { label: "Learn Bioprinting", href: "/consultancy" },
  { label: "About Us", href: "/our-story" },
  { label: "Blogs", href: "/blogs" },
  { label: "Publications", href: "/publications" },
  { label: "Careers", href: "/team#careers" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

const RESOURCES = [
  { label: "Get A Quote", href: "/#connect" },
  { label: "Enquire about Our Course", href: "/#connect" },
  { label: "Contact Us", href: "/#connect" },
  { label: "Partner With Us", href: "/#connect" },
  { label: "Become An Investor", href: "/#connect" },
];

const LINK_COLUMNS = [
  { heading: "Quick Links", links: QUICK_LINKS },
  { heading: "Resources", links: RESOURCES },
];

const Footer: FC = () => (
  <footer
    role="contentinfo"
    className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)]"
  >
    {/* pb-24 clears MobileStickyCTA, which is fixed to the bottom on phones. */}
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 sm:pb-8 lg:pt-14">
      {/* Main content: three equal columns,
          Quick Links · Resources · brand + Follow Us */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12">
        {/* Columns 1 & 2: Quick Links + Resources */}
        {LINK_COLUMNS.map((col) => (
          <nav
            key={col.heading}
            aria-label={col.heading}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-3">
              <p className="text-[15px] font-semibold text-[var(--color-ink)]">
                {col.heading}
              </p>
              <span
                aria-hidden="true"
                className="h-0.5 w-10 rounded-full bg-[var(--color-brand)]"
              />
            </div>
            <ul className="flex flex-col gap-3" role="list">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Column 3: brand logo above the Follow Us dock */}
        <div className="flex flex-col gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/recognition/nbil-logo.png"
            alt={COMPANY.name}
            className="h-35 w-auto self-start"
          />
          <div className="flex flex-col gap-4">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">
              Follow Us
            </p>
            <MagneticDock />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-14 pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
          Copyright &copy;{new Date().getFullYear()} {COMPANY.short}. All rights reserved
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy-policy"
            className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Terms of Service
          </Link>
        </div>
        <a
          href={COMPANY.site}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
        >
          <CompanyName />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
