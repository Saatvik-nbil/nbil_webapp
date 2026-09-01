import type { Metadata } from "next";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import NewsletterSection, {
  SUBSCRIBE_URL,
} from "@/app/components/blog/NewsletterSection";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "The NBIL bioprinting newsletter — research breakdowns and biofabrication news, published on Substack. Subscribe or read recent issues.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/newsletter" },
};

export default function NewsletterPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-[var(--color-dark-bg)] pt-32 pb-28 lg:pt-40 lg:pb-32">
          <PhotoHeroBackdrop
            src="/images/heroes/newsletter-hero.webp"
            objectPosition="62% 58%"
            fadeTo="255,255,255"
            fadeHeight="30%"
          />
          <div className="relative w-full max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-start gap-5 max-w-3xl">
              <p className="eyebrow text-[var(--color-dark-brand)]">
                Newsletter
              </p>
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-white leading-[1.04]">
                The NBIL bioprinting newsletter
              </h1>
              <p className="text-[16px] lg:text-[17px] text-white/75 leading-relaxed">
                Research breakdowns and biofabrication news, published on
                Substack. Subscribe for new issues, or read any of the recent
                ones below.
              </p>
              <a
                href={SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)]"
              >
                <EnvelopeSimple size={18} weight="bold" />
                Subscribe to newsletter
              </a>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
