"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WarningOctagon, ArrowClockwise } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";

/**
 * Root error boundary: catches any render/data error that escapes the page
 * tree. Deliberately self-contained: no NavBar/Footer/site chrome. If those
 * (or something they depend on) are what threw, re-rendering them here would
 * just crash again: this has to be the one component on the site that can't
 * itself fail.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-[100svh] items-center justify-center bg-[var(--color-canvas)] px-6"
    >
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
          <WarningOctagon size={30} weight="duotone" className="text-red-600" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            Something went wrong
          </h1>
          <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            An unexpected error interrupted this page. Try again, or head back
            to the homepage. If it keeps happening, let us know.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <OriginButton onClick={() => reset()} className="h-11 px-6 text-[15px]">
            <ArrowClockwise size={16} weight="bold" />
            Try again
          </OriginButton>
          <Link
            href="/"
            className="text-[14px] font-medium text-[var(--color-brand-strong)] underline-offset-4 hover:underline"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
