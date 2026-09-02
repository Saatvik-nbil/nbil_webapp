import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import DheeGuide from "@/app/components/dhee/DheeGuide";

export const metadata: Metadata = {
  title: "Dhee Slicer Quick-Start Guide",
  description:
    "Step-by-step guide to your first print with Dhee Slicer: requirements, model import, slicing settings, G-code preview and machine control.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/dhee-slicer/guide" },
  openGraph: {
    type: "website",
    url: "https://nextbiginnovationlabs.com/dhee-slicer/guide",
    title: "Dhee Slicer Quick-Start Guide",
    description:
      "Step-by-step guide to your first print with Dhee Slicer: requirements, model import, slicing settings, G-code preview and machine control.",
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

export default function DheeGuidePage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DheeGuide />
      </main>
      <Footer />
    </>
  );
}
