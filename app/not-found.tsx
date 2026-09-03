import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ArrowRight, House } from "@phosphor-icons/react/dist/ssr";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { OriginButton } from "@/components/ui/origin-button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const SUGGESTED_LINKS = [
  { label: "Trivima Bioprinters", href: "/trivima" },
  { label: "Consultancy", href: "/consultancy" },
  { label: "Blog", href: "/blogs" },
  { label: "Our story", href: "/our-story" },
];

/** App Router's not-found UI: rendered for any unmatched route, or wherever
    `notFound()` is called (e.g. an unknown machine slug). Full site chrome
    stays intact so a lost visitor can navigate out normally, rather than
    hitting a dead end. */
export default function NotFound() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <section className="flex min-h-[70svh] items-center py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-[var(--color-brand-surface)]">
              <Compass size={30} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
            </span>

            <div className="flex flex-col gap-3">
              <p className="font-display text-[clamp(4.5rem,14vw,8rem)] font-bold leading-none tracking-[-0.03em] text-[var(--color-brand)]">
                404
              </p>
              <h1 className="font-display text-[2.25rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] sm:text-[2.75rem]">
                We couldn&apos;t find that page
              </h1>
              <p className="text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]">
                The page you&apos;re looking for may have moved or no longer exists.
                Try one of these instead, or head back home.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <OriginButton href="/" className="h-11 px-6 text-[15px]">
                <House size={16} weight="bold" />
                Back home
              </OriginButton>
              <OriginButton
                href="/trivima"
                variant="outline"
                className="h-11 px-6 text-[15px]"
              >
                Explore the bioprinters
                <ArrowRight size={16} weight="bold" />
              </OriginButton>
            </div>

            <nav aria-label="Suggested pages" className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {SUGGESTED_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13.5px] text-[var(--color-ink-muted)] underline-offset-4 transition-colors hover:text-[var(--color-brand-strong)] hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
