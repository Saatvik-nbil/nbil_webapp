"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { OriginButton } from "@/components/ui/origin-button";
import { setAnalyticsConsent } from "@/lib/analytics";

const CONSENT_KEY = "nbil-cookie-consent"; // "accepted" | "rejected"

/**
 * Gates PostHog on an explicit choice rather than a cosmetic banner: analytics
 * loads opted-out by default (see lib/analytics.ts), and this is the only
 * place that ever calls setAnalyticsConsent. A stored decision from a past
 * visit is applied silently on mount — the banner only shows once, ever,
 * per browser (until localStorage is cleared).
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      // localStorage unavailable (private mode, locked-down browser) — skip
      // the banner rather than nag on every load with no way to persist.
      return;
    }

    if (stored === "accepted") {
      setAnalyticsConsent(true);
    } else if (stored === "rejected") {
      setAnalyticsConsent(false);
    } else {
      setVisible(true);
    }
  }, []);

  function decide(accepted: boolean) {
    try {
      localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "rejected");
    } catch {
      // Decision just won't persist — still honour it for this page view.
    }
    setAnalyticsConsent(accepted);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          aria-describedby="cookie-consent-copy"
          initial={reduce ? false : { y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 16, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[90] mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)]/95 p-5 shadow-[0_18px_50px_rgba(2,12,27,0.16)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-5"
        >
          <p
            id="cookie-consent-copy"
            className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]"
          >
            We use cookies for analytics, to understand how visitors use the
            site and improve it.{" "}
            <Link
              href="/privacy-policy#cookies"
              className="font-medium text-[var(--color-brand-strong)] hover:underline underline-offset-4"
            >
              Learn more
            </Link>
          </p>

          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={() => decide(false)}
              className="h-9 rounded-lg border border-[var(--color-hairline)] px-4 text-[13px] font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              Reject
            </button>
            <OriginButton
              type="button"
              onClick={() => decide(true)}
              className="h-9 px-4 text-[13px]"
            >
              Accept
            </OriginButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
