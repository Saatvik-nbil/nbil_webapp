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

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  alternateName: COMPANY.short,
  url: COMPANY.site,
  email: COMPANY.email,
  telephone: "+91-6364-596-016",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560082",
    addressCountry: "IN",
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

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
