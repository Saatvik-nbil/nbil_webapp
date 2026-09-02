import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import RecentBlogs from "@/app/components/blog/RecentBlogs";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Bioprinting insights and research breakdowns from Next Big Innovation Labs — deep dives on bioprinting, biomaterials and biofabrication.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/blogs" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/blogs",
    title: "Blog — Next Big Innovation Labs",
    description:
      "Bioprinting insights and research breakdowns from Next Big Innovation Labs — deep dives on bioprinting, biomaterials and biofabrication.",
    images: [
      {
        url: "/images/heroes/blogs-hero.webp",
        width: 1200,
        height: 630,
        alt: "Next Big Innovation Labs blog",
      },
    ],
  },
};

export default function BlogsPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-[var(--color-dark-bg)] pt-32 pb-28 lg:pt-40 lg:pb-32">
          <PhotoHeroBackdrop
            src="/images/heroes/blogs-hero.webp"
            objectPosition="65% center"
            fadeTo="248,250,252"
            fadeHeight="30%"
          />
          <div className="relative w-full max-w-7xl mx-auto px-6">
            <div className="flex flex-col gap-5 max-w-3xl">
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-white leading-[1.04]">
                Insights from the lab
              </h1>
              <p className="text-[16px] lg:text-[17px] text-white/75 leading-relaxed">
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
