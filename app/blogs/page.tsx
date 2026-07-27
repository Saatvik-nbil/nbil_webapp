import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import RecentBlogs from "@/app/components/blog/RecentBlogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Bioprinting insights and research breakdowns from Next Big Innovation Labs — deep dives on bioprinting, biomaterials and biofabrication.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/blogs" },
};

export default function BlogsPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section className="bg-[var(--color-canvas)] pt-32 pb-8 lg:pt-40 lg:pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-5 max-w-3xl">
              <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                Blog
              </p>
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)] leading-[1.04]">
                Insights from the lab
              </h1>
              <p className="text-[16px] lg:text-[17px] text-[var(--color-ink-muted)] leading-relaxed">
                Deep dives on bioprinting, biomaterials and biofabrication from
                the NBIL team.
              </p>
            </div>
          </div>
        </section>

        <RecentBlogs />
      </main>
      <Footer />
    </>
  );
}
