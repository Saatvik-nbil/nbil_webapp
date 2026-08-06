import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import OurStoryLanding from "@/app/components/company/OurStoryLanding";
import { STORY_MILESTONES } from "@/lib/story";
import { COMPANY } from "@/lib/machines";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The full record of Next Big Innovation Labs, from a Bengaluru startup in 2016 to a World Economic Forum Technology Pioneer and Engineering Product of the Year — every patent, grant, collaboration and recognition along the way.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/our-story" },
  openGraph: {
    type: "article",
    url: "https://nextbiginnovationlabs.com/our-story",
    title: "Our Story — Next Big Innovation Labs",
    description:
      "Ten years from a bold idea to a working range: the milestones, patents, grants and collaborations behind the Trivima bioprinter range.",
    images: [
      {
        url: "/images/np-side.png",
        width: 1200,
        height: 630,
        alt: "Next Big Innovation Labs bioprinter",
      },
    ],
  },
};

// Structured data is derived from the same list the page renders, so awards
// can never drift out of sync with the visible copy.
const storySchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  alternateName: COMPANY.short,
  url: COMPANY.site,
  foundingDate: "2016",
  foundingLocation: "Bengaluru, Karnataka, India",
  description:
    "Next Big Innovation Labs develops bioprinting solutions for researchers and clinicians focused on drug development, regenerative medicine and bioengineered organ fabrication.",
  award: STORY_MILESTONES.filter(
    (m) => m.category === "Award" || m.category === "Recognition"
  ).map((m) => `${m.title}, ${m.year}`),
};

export default function OurStoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storySchema) }}
      />

      <NavBar />
      <main id="main-content">
        <OurStoryLanding />
      </main>
      <Footer />
    </>
  );
}
