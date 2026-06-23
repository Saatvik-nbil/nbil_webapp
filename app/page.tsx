import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import CompanyHero from "@/app/components/company/CompanyHero";
import CredibilityStrip from "@/app/components/company/CredibilityStrip";
import IntegrationHero from "@/components/ui/integration-hero";
import MissionScroll from "@/app/components/company/MissionScroll";
import FocusAreas from "@/app/components/company/FocusAreas";
import StoryTimeline from "@/app/components/company/StoryTimeline";
import ProductsShowcase from "@/app/components/company/ProductsShowcase";
import ValuesSection from "@/app/components/company/ValuesSection";
import LeadershipSection from "@/app/components/company/LeadershipSection";
import CompanyConnect from "@/app/components/company/CompanyConnect";
import Footer from "@/app/components/Footer";
import { COMPANY } from "@/lib/machines";

export const metadata: Metadata = {
  title: "Next Big Innovation Labs — Bioprinting for a Better Future",
  description:
    "Next Big Innovation Labs (NBIL) builds the bioprinting instruments researchers and clinicians use to model disease, develop drugs, and engineer living tissue. Founded 2016 in Bengaluru. World Economic Forum Technology Pioneer 2023.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/",
    title: "Next Big Innovation Labs — Bioprinting for a Better Future",
    description:
      "We set out to print a better future. NBIL builds bioprinting hardware and software for research, regenerative medicine and bioengineered organs.",
    images: [{ url: "/images/np-side.png", width: 1200, height: 630, alt: "Next Big Innovation Labs bioprinter" }],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  alternateName: COMPANY.short,
  url: COMPANY.site,
  email: COMPANY.email,
  telephone: "+91-6364-596-016",
  foundingDate: "2016",
  description:
    "Next Big Innovation Labs develops bioprinting solutions for researchers and clinicians focused on drug development, regenerative medicine and bioengineered organ fabrication.",
  founder: [
    { "@type": "Person", name: "Piyush Padmanabhan", jobTitle: "CEO, Co-Founder & Director" },
    { "@type": "Person", name: "Pooja Venkatesh", jobTitle: "Co-CEO & Co-Founder" },
    { "@type": "Person", name: "Alok Medikepura Anil", jobTitle: "Co-Founder & Director" },
  ],
  award: "World Economic Forum Technology Pioneer 2023",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560082",
    addressCountry: "IN",
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <NavBar />
      <main id="main-content">
        <CompanyHero />
        <CredibilityStrip />
        <IntegrationHero />
        <MissionScroll />
        <FocusAreas />
        <StoryTimeline />
        <ProductsShowcase />
        <ValuesSection />
        <LeadershipSection />
        <CompanyConnect />
      </main>
      <Footer />
    </>
  );
}
