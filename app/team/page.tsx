import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import TeamLanding from "@/app/components/team/TeamLanding";
import CareersSection from "@/app/components/team/CareersSection";

/**
 * Team and careers are one page: the pitch to join sits under the people you
 * would be joining. The old `/careers` route redirects to `#careers` here
 * (see next.config.ts).
 */
export const metadata: Metadata = {
  title: "Our Team and Careers",
  description:
    "Meet the people behind Next Big Innovation Labs: the founders and the engineers, scientists and makers who build the Trivima bioprinter range, and how to join them.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/team" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/team",
    title: "Our Team and Careers | Next Big Innovation Labs",
    description:
      "Meet the founders, engineers, scientists and makers behind the Trivima bioprinter range, and see what it is like to build here.",
    images: [
      {
        url: "/images/np-side.webp",
        width: 1200,
        height: 630,
        alt: "Next Big Innovation Labs bioprinter",
      },
    ],
  },
};

export default function TeamPage() {
  return (
    <>
      <NavBar />
      <TeamLanding />
      <CareersSection />
      <Footer />
    </>
  );
}
