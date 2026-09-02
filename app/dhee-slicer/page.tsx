import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import DheeLanding from "@/app/components/dhee/DheeLanding";

export const metadata: Metadata = {
  title: "Dhee Slicer — Bioprinting Software by NBIL",
  description:
    "Dhee Slicer replaces model preparation, slicing and machine control with one application. Built in-house by Next Big Innovation Labs for the Trivima bioprinter range.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/dhee-slicer" },
  openGraph: {
    title: "Dhee Slicer — Bioprinting Software by NBIL",
    description:
      "One application for model preparation, slicing and machine control, built for bioprinting.",
    url: "https://nextbiginnovationlabs.com/dhee-slicer",
    type: "website",
    images: [
      {
        url: "/dhee/machine.webp",
        width: 1200,
        height: 630,
        alt: "Dhee Slicer's G-code visualization of a bioprinting toolpath",
      },
    ],
  },
};

export default function DheeSlicerPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DheeLanding />
      </main>
      <Footer />
    </>
  );
}
