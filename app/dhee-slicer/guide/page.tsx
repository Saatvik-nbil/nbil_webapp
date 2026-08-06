import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import DheeGuide from "@/app/components/dhee/DheeGuide";

export const metadata: Metadata = {
  title: "Dhee Slicer Quick-Start Guide",
  description:
    "Step-by-step guide to your first print with Dhee Slicer: requirements, model import, slicing settings, G-code preview and machine control.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/dhee-slicer/guide" },
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
