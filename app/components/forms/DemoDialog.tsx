"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";
import QuoteForm from "./QuoteForm";

const EASE = [0.16, 1, 0.3, 1] as const;

type LenisLike = { stop: () => void; start: () => void };

/**
 * "Request a demo" as a popup: the quote form, preset to a live demo, in a
 * dialog that fades and rises in over the page instead of navigating away.
 * `trigger` is the button that opens it (rendered via Dialog.Trigger asChild).
 */
export default function DemoDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Lenis owns wheel scrolling site-wide; pause it while the dialog is up so
  // the page behind stays put.
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-[rgba(2,12,27,0.45)] backdrop-blur-sm"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                data-lenis-prevent
                className="fixed left-1/2 top-1/2 z-[91] flex max-h-[min(90svh,52rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.5rem] border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_30px_80px_rgba(2,12,27,0.28)] focus:outline-none"
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--color-hairline)] px-6 py-5 sm:px-8">
                  <div className="flex flex-col gap-1">
                    <Dialog.Title className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                      Request a demo
                    </Dialog.Title>
                    <p className="text-[14px] text-[var(--color-ink-muted)]">
                      See a Trivima bioprinter at work. We will confirm a slot within 2 business days.
                    </p>
                  </div>
                  <Dialog.Close
                    aria-label="Close"
                    className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]"
                  >
                    <X size={18} weight="bold" />
                  </Dialog.Close>
                </div>
                <div className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
                  <QuoteForm defaultInterest="Book a live demo" />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
