import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import GuidesList from "@/app/components/blog/GuidesList";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Step-by-step guides from Next Big Innovation Labs — get up and running with Trivima bioprinters and Dhee software.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-[var(--color-dark-bg)] pt-32 pb-28 lg:pt-40 lg:pb-32">
          <PhotoHeroBackdrop
            src="/images/heroes/guides-hero-cartridges.webp"
            objectPosition="58% 52%"
            fadeTo="248,250,252"
            fadeHeight="30%"
          />
          <div className="relative w-full max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-5 max-w-3xl">
              <p className="eyebrow text-[var(--color-dark-brand)]">
                Guides
              </p>
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-white leading-[1.04]">
                Get up and running
              </h1>
              <p className="text-[16px] lg:text-[17px] text-white/75 leading-relaxed">
                Step-by-step guides to help you get the most out of Trivima
                bioprinters and{" "}
                <Link
                  href="/dhee-slicer"
                  className="font-medium text-[var(--color-dark-brand)] underline underline-offset-4 hover:no-underline"
                >
                  Dhee
                </Link>{" "}
                software.
              </p>
            </div>
          </div>
        </section>

        <GuidesList />
      </main>
      <Footer />
    </>
  );
}
