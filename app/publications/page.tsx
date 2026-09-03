import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import PublicationsLanding from "@/app/components/publications/PublicationsLanding";
import { publications } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Peer-reviewed research published by labs using Trivima bioprinters: cardiac tissue, bone scaffolds, breast cancer models, drug delivery hydrogels. Abstracts and links to every paper.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/publications" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/publications",
    title: "Publications | Next Big Innovation Labs",
    description:
      "Peer-reviewed research published by labs using Trivima bioprinters, with abstracts and links to every paper.",
    images: [
      {
        url: "/images/np-side.webp",
        width: 1200,
        height: 630,
        alt: "Trivima bioprinters by Next Big Innovation Labs",
      },
    ],
  },
};

/* Structured data: the papers as a list of scholarly articles. */
const schema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Research published using Trivima bioprinters",
  itemListElement: publications.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "ScholarlyArticle",
      headline: p.title,
      author: p.authors.map((name) => ({ "@type": "Person", name })),
      datePublished: p.year,
      isPartOf: { "@type": "Periodical", name: p.journal },
      identifier: `https://doi.org/${p.doi}`,
      url: p.url,
      abstract: p.abstract,
    },
  })),
};

export default function PublicationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <NavBar />
      <PublicationsLanding />
      <Footer />
    </>
  );
}
