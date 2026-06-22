import type { FC } from "react";
import Link from "next/link";
import { machines, COMPANY } from "@/lib/machines";

const RESOURCE_LINKS = [
  { label: "All bioprinters", href: "/trivima" },
  { label: "Compare models", href: "/trivima#compare" },
  { label: "Control software", href: "/trivima#software" },
  { label: "Applications", href: "/trivima#applications" },
];

const COMPANY_LINKS = [
  { label: "About NBIL", href: "/" },
  { label: "Our story", href: "/#story" },
  { label: "Learn bioprinting", href: "https://nextbiginnovationlabs.com/certified-course-on-bioprinting/" },
  { label: "Contact", href: "/#connect" },
];

const Footer: FC = () => (
  <footer
    role="contentinfo"
    className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)]"
  >
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div>
            <p className="text-[16px] font-display font-semibold text-[var(--color-ink)] tracking-tight">
              {COMPANY.name}
            </p>
            <p className="text-[13px] text-[var(--color-ink-muted)] mt-0.5">
              Makers of Trivima bioprinters
            </p>
          </div>
          <p className="text-[12px] text-[var(--color-ink-faint)] leading-relaxed max-w-[28ch]">
            Bioprinting hardware and software for research, regenerative medicine and bioengineered organs.
          </p>
          <address className="not-italic text-[12px] text-[var(--color-ink-faint)] leading-relaxed">
            {COMPANY.address.line1}
            <br />
            {COMPANY.address.line2}
            <br />
            {COMPANY.address.city}
            <br />
            {COMPANY.address.country}
          </address>
          <div className="flex flex-col gap-1">
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-brand-strong)] transition-colors"
            >
              {COMPANY.email}
            </a>
            <a
              href={`tel:${COMPANY.phoneHref}`}
              className="text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-brand-strong)] transition-colors"
            >
              {COMPANY.phone}
            </a>
          </div>
        </div>

        {/* Models */}
        <div className="flex flex-col gap-4">
          <p className="text-[12px] font-semibold text-[var(--color-ink)]">Models</p>
          <nav aria-label="Model links">
            <ul className="flex flex-col gap-2.5" role="list">
              {machines.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/machines/${m.slug}`}
                    className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors leading-relaxed"
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-4">
          <p className="text-[12px] font-semibold text-[var(--color-ink)]">Explore</p>
          <nav aria-label="Explore links">
            <ul className="flex flex-col gap-2.5" role="list">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <p className="text-[12px] font-semibold text-[var(--color-ink)]">Company</p>
          <nav aria-label="Company links">
            <ul className="flex flex-col gap-2.5" role="list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors leading-relaxed"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-14 pt-6 border-t border-[var(--color-hairline-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-[12px] text-[var(--color-ink-faint)]">
          &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </p>
        <p className="text-[11px] font-mono text-[var(--color-ink-faint)]">
          NBIL · Bioprinting for a better future
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
