import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import NewsLanding from "@/app/components/news/NewsLanding";

export const metadata: Metadata = {
  title: "News",
  description:
    "Press, milestones and the latest from Next Big Innovation Labs — including recent posts straight from our LinkedIn feed.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/news" },
};

export default function NewsPage() {
  return (
    <>
      <NavBar />
      <NewsLanding />
      <Footer />
    </>
  );
}
