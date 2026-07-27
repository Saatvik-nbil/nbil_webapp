import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import NewsletterSection from "@/app/components/blog/NewsletterSection";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "The NBIL bioprinting newsletter — research breakdowns and biofabrication news, published on Substack. Subscribe or read recent issues.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/newsletter" },
};

export default function NewsletterPage() {
  return (
    <>
      <NavBar />
      <main>
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
