import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import TeamLanding from "@/app/components/team/TeamLanding";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the people behind Next Big Innovation Labs — the founders and the engineers, scientists and makers who build the Trivima bioprinter range.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/team" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/team",
    title: "Our Team — Next Big Innovation Labs",
    description:
      "Meet the people behind Next Big Innovation Labs — the founders and the engineers, scientists and makers who build the Trivima bioprinter range.",
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
      <Footer />
    </>
  );
}
