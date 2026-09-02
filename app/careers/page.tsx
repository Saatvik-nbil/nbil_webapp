import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import CareersLanding from "@/app/components/careers/CareersLanding";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build your career with Next Big Innovation Labs. Explore why people love working at NBIL — professional development, growth, recognition, work-life balance and a great culture — and apply to join our bioprinting team.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/careers" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/careers",
    title: "Careers — Next Big Innovation Labs",
    description:
      "Explore why people love working at NBIL — professional development, growth, recognition, work-life balance and a great culture — and apply to join our bioprinting team.",
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

export default function CareersPage() {
  return (
    <>
      <NavBar />
      <CareersLanding />
      <Footer />
    </>
  );
}
