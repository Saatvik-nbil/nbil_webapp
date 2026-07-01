import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import CareersLanding from "@/app/components/careers/CareersLanding";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Build your career with Next Big Innovation Labs. Explore why people love working at NBIL — professional development, growth, recognition, work-life balance and a great culture — and apply to join our bioprinting team.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/careers" },
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
