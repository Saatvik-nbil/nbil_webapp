import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import CatalogHero from "@/app/components/catalog/CatalogHero";
import ModelsSection from "@/app/components/catalog/ModelsSection";
import CompareTable from "@/app/components/catalog/CompareTable";
import ApplicationsSection from "@/app/components/catalog/ApplicationsSection";
import CatalogSoftware from "@/app/components/catalog/CatalogSoftware";
import TestimonialsSection from "@/app/components/catalog/TestimonialsSection";
import ContactSection from "@/app/components/ContactSection";
import Footer from "@/app/components/Footer";
import { machines, COMPANY } from "@/lib/machines";

export const metadata: Metadata = {
  title: "Trivima Bioprinters — The Full Range, Spec for Spec",
  description:
    "Explore the Trivima bioprinter range by NBIL: the non-planar NP, the six-extruder Pro and the light-based Aura. Compare extrusion, inkjet, pellet and MSLA systems spec for spec.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/trivima-bioprinter/" },
};

/* ---- Structured data: ItemList of all products ---- */
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Trivima Bioprinter Range",
  description:
    "The full range of Trivima bioprinters by Next Big Innovation Labs, from compact benchtop extrusion systems to non-planar rotary and light-based platforms.",
  itemListElement: machines.map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: m.fullName,
      url: `https://nextbiginnovationlabs.com/machines/${m.slug}`,
      description: m.blurb,
      brand: { "@type": "Brand", name: COMPANY.name, alternateName: COMPANY.short },
      category: "Scientific Equipment",
    },
  })),
};

export default function TrivimaCatalogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <NavBar />
      <main id="main-content">
        <CatalogHero />
        <ModelsSection />
        <CompareTable />
        <ApplicationsSection />
        <CatalogSoftware />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
