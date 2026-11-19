import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import RecentBlogs from "@/app/components/blog/RecentBlogs";
import PhotoHeroBackdrop from "@/app/components/PhotoHeroBackdrop";
import { HeroExit, MaskedTitle, RiseIn } from "@/app/components/motion/ScrollFx";

export const metadata: Metadata = {
  title: "Next Big Blogs",
  description:
    "Bioprinting insights and research breakdowns from Next Big Innovation Labs, with deep dives on bioprinting, biomaterials and biofabrication.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/blogs" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/blogs",
    title: "Next Big Blogs | Next Big Innovation Labs",
    description:
      "Bioprinting insights and research breakdowns from Next Big Innovation Labs, with deep dives on bioprinting, biomaterials and biofabrication.",
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
        <section data-nav-theme="dark" className="relative isolate flex min-h-svh items-center overflow-hidden bg-[var(--color-photo-ground)] pt-32 pb-28 lg:pt-40 lg:pb-32">
          <PhotoHeroBackdrop
            src="/images/heroes/blogs-hero.webp"
            objectPosition="65% center"
            scrim="clear"
          />
          <div className="relative w-full max-w-7xl mx-auto px-6">
            <HeroExit className="flex flex-col gap-5 max-w-3xl" distance={160} fadeTo={0}>
              <MaskedTitle className="h1 text-white" text="Next Big Blogs" />
              <RiseIn as="p" delay={0.3} className="text-[16px] lg:text-[17px] text-white/90 leading-relaxed">
                Deep dives on bioprinting, biomaterials and biofabrication from
                the Next Big Innovation Labs team.
              </RiseIn>
            </HeroExit>
          </div>
        </section>

        <RecentBlogs />
      </main>
      <Footer />
    </>
  );
}
