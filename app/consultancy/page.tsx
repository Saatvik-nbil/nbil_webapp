import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ConsultancyHero from "@/app/components/consultancy/ConsultancyHero";
import CaseStudies from "@/app/components/consultancy/CaseStudies";
import ConsultationExpectations from "@/app/components/consultancy/ConsultationExpectations";
import ConsultancyServices from "@/app/components/consultancy/ConsultancyServices";
import ConsultancyTestimonials from "@/app/components/consultancy/ConsultancyTestimonials";
import ProjectForm from "@/app/components/consultancy/ProjectForm";
import ConsultancyProcess from "@/app/components/consultancy/ConsultancyProcess";

export const metadata: Metadata = {
  title: "Bioprinting Consultancy",
  description:
    "Bioprinting consultancy from Next Big Innovation Labs — get matched with a specialist and a tailored roadmap covering hardware, bioinks and protocols for your specific tissue model.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/consultancy" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/consultancy",
    title: "Bioprinting Consultancy — Next Big Innovation Labs",
    description:
      "Get matched with a bioprinting specialist and a tailored roadmap covering hardware, bioinks and protocols for your specific tissue model.",
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

export default function ConsultancyPage() {
  return (
    <>
      <NavBar />
      <main>
        <ConsultancyHero />
        <CaseStudies />
        <ConsultationExpectations />
        <ConsultancyServices />
        <ConsultancyTestimonials />
        <ProjectForm />
        <ConsultancyProcess />
      </main>
      <Footer />
    </>
  );
}
