import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import TeamLanding from "@/app/components/team/TeamLanding";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the people behind Next Big Innovation Labs — the founders and the engineers, scientists and makers who build the Trivima bioprinter range.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/team" },
};

export default function TeamPage() {
  return (
    <>
      <NavBar />
      <TeamLanding />
      <Footer />
    </>
  );
}
