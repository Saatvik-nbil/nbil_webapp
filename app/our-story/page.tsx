import type { Metadata } from "next";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { Timeline, type TimelineItem } from "@/components/ui/modern-timeline";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ten years from a bold idea to a working range — the story of Next Big Innovation Labs, from its founding in Bengaluru in 2016 to a shipping Trivima bioprinter range today.",
  alternates: { canonical: "https://nextbiginnovationlabs.com/our-story" },
};

const MILESTONES: TimelineItem[] = [
  {
    title: "The starting line",
    description:
      "Founded in Bengaluru to build technology around transplant organs and bridge research and the clinic.",
    date: "2016",
    category: "Foundation",
    status: "completed",
  },
  {
    title: "Autodesk & Bangalore Bioinnovation Centre",
    description:
      "Collaborations with Autodesk and the Bangalore Bioinnovation Centre accelerate our design tooling and lab infrastructure.",
    date: "2017",
    category: "Collaboration",
    status: "completed",
  },
  {
    title: "Merck KGaA collaboration",
    description:
      "A collaboration with Merck KGaA broadens access to biomaterials and life-science expertise.",
    date: "2018",
    category: "Partnership",
    status: "completed",
  },
  {
    title: "First patents",
    description:
      "Two foundational bioprinting patents granted, protecting the core extrusion approach.",
    date: "2019",
    category: "Patents",
    status: "completed",
  },
  {
    title: "Printing human tissue",
    description:
      "A process patent for bioprinting human tissue moves the platform toward clinical relevance.",
    date: "2020",
    category: "R&D",
    status: "completed",
  },
  {
    title: "Microsoft for Startups",
    description:
      "Selected into the Microsoft Startup Program, scaling the software and cloud workflow.",
    date: "2021",
    category: "Programs",
    status: "completed",
  },
  {
    title: "HiMedia partnership",
    description:
      "Strategic partnership with HiMedia Laboratories expands biomaterials and reach.",
    date: "2022",
    category: "Partnership",
    status: "completed",
  },
  {
    title: "WEF Technology Pioneer",
    description:
      "Named a World Economic Forum Technology Pioneer; signed an R&D MoU with the Karnataka government.",
    date: "2023",
    category: "Recognition",
    status: "completed",
  },
  {
    title: "A full range, a community",
    description:
      "A focused Trivima range shipping and 600+ researchers trained through Next Big Learning.",
    date: "Today",
    category: "Milestone",
    status: "current",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <NavBar />
      <main className="bg-[var(--color-canvas)]">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-6 lg:pt-40 lg:pb-8">
          <div className="flex flex-col gap-5 max-w-3xl">
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              Our story
            </p>
            <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)] leading-[1.04]">
              Ten years from a bold idea to a working range
            </h1>
            <p className="text-[16px] lg:text-[17px] text-[var(--color-ink-muted)] leading-relaxed">
              Since 2016, NBIL has built the bioprinting instruments researchers
              and clinicians rely on. One mission, printed one layer at a time.
            </p>
          </div>
        </section>

        <Timeline items={MILESTONES} className="pb-24 lg:pb-32" />
      </main>
      <Footer />
    </>
  );
}
