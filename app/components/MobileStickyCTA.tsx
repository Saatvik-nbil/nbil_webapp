"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";

// Legal pages get a bar that just adds noise, not conversions.
const HIDDEN_ON = ["/privacy-policy", "/terms"];

/**
 * Persistent bottom action bar, phone screens only (`sm:hidden`). Sits above
 * the safe-area inset so it clears the home-indicator on notched devices.
 * BackToTop.tsx shifts its own mobile offset up to clear this bar. See the
 * comment there.
 */
export default function MobileStickyCTA() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-hairline)] bg-[var(--color-surface)]/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(2,12,27,0.1)] backdrop-blur-sm sm:hidden [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
      <Link
        href="/#connect"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] text-[15px] font-semibold text-white transition-colors active:bg-[var(--color-brand-hover)]"
      >
        Talk to us
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  );
}
