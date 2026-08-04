import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import GuidesList from "@/app/components/blog/GuidesList";

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
        <section className="bg-[var(--color-canvas)] pt-32 pb-8 lg:pt-40 lg:pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-5 max-w-3xl">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                Guides
              </p>
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)] leading-[1.04]">
                Get up and running
              </h1>
              <p className="text-[16px] lg:text-[17px] text-[var(--color-ink-muted)] leading-relaxed">
                Step-by-step guides to help you get the most out of Trivima
                bioprinters and Dhee software.
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
