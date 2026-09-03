"use client";

import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";

type Post = {
  title: string;
  excerpt: string;
  image: string;
  href: string;
  date: string;
  tags: string[];
  /** Posts hosted on this site render as internal links. */
  internal?: boolean;
  readTime?: string;
};

// Seeded from nextbiginnovationlabs.com/blogs. New posts can be prepended here.
const POSTS: Post[] = [
  {
    title:
      "Bioprinting and Beyond: The Future of Interdisciplinary STEM Education",
    excerpt:
      "The power of interdisciplinary learning and why blending biology, engineering and design matters for advancing science.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2025/01/Interdisciplinary-Learning.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/advancing-bioprinting-education/",
    date: "Jan 10, 2025",
    tags: ["Education"],
  },
  {
    title:
      "Bioprinting Spheroids for High-Throughput Applications: Advancing Cancer Research",
    excerpt:
      "How spheroids act as 3D cell structures that mimic human tissue environments to accelerate cancer research.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/10/Bioprinting-Spheroids-for-High-Throughput-Applications-Advancing-Cancer-Research.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/bioprinting-spheroids/",
    date: "Oct 15, 2024",
    tags: ["Cancer Research"],
  },
  {
    title: "GelMA: 5 Reasons to Choose it as Your Next Bioink for Bioprinting",
    excerpt:
      "Why Gelatin Methacryloyl (GelMA) has become one of the most versatile and widely used bioprinting materials.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/07/Gelatin-Methacryloyl-GelMA.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/5-reasons-to-choose-gelma-for-bioprinting/",
    date: "Jul 27, 2024",
    tags: ["Bioinks"],
  },
  {
    title: "Bioprinting 101: Glossary",
    excerpt:
      "A reference guide to the key terminology used across bioprinting technology, from bioinks to crosslinking.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/04/Exploring-Key-Terminologies-in-Bioprinting.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/bioprinting-101-glossary/",
    date: "Apr 22, 2024",
    tags: ["Guide"],
  },
  {
    title: "Bioprinting 101: Troubleshooting Common Challenges and Solutions",
    excerpt:
      "Practical fixes for the most common bioprinting problems, from needle collisions and air bubbles to cell viability and scaffold integrity.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/04/Troubleshooting-Common-Bioprinting-Challenges-and-Solutions.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/bioprinting-101-troubleshooting-common-challenges-and-solutions/",
    date: "Apr 15, 2024",
    tags: ["Troubleshooting"],
  },
  {
    title: "Trivima Mini and Prime Minister Modi",
    excerpt:
      "How Next Big Innovation Labs' Trivima Mini bioprinter was showcased to Prime Minister Narendra Modi at India's National Technology Week.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/03/Bioprinting-in-Space-Bioprinting-in-Zero-G-2.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/trivima-mini-and-prime-minister-modi/",
    date: "Mar 21, 2024",
    tags: ["News"],
  },
  {
    title: "Bioprinting in Space: Bioprinting in Zero G",
    excerpt:
      "Exploring how bioprinting operates in microgravity, and the collaborations shaping tissue engineering beyond Earth.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/03/Bioprinting-in-Space-Bioprinting-in-Zero-G.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/bioprinting-in-space-zero-g/",
    date: "Mar 11, 2024",
    tags: ["Research"],
  },
  {
    title: "Biomaterials for Bioprinting: Top 5 Materials!",
    excerpt:
      "Five biomaterials reshaping tissue engineering, from GelMA and sodium alginate to collagen and Pluronic F127.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/03/Biomaterials-for-Bioprinting-TOP-5-MATERIALS-.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/biomaterials-for-bioprinting-top-5-materials/",
    date: "Mar 11, 2024",
    tags: ["Biomaterials"],
  },
  {
    title: "3D Printing or Bioprinting? Navigating the Difference",
    excerpt:
      "How bioprinting builds on conventional 3D printing by using living cells and biocompatible materials to create functional tissue.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/02/3D-Printing-or-3D-Bioprinting-by-NBIL.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/3d-printing-or-bioprinting-navigating-the-difference/",
    date: "Feb 7, 2024",
    tags: ["Guide"],
  },
  {
    title: "Bioinks: The Secret Sauce of Bioprinting, for Building Your Tissues",
    excerpt:
      "Why bioinks (the formulated blend of cells, biomaterials and nutrients) sit at the heart of every successful bioprint.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2023/11/Bioink-Next-Big-Innovation-Labs.png?fit=1200%2C628&ssl=1",
    href: "https://nextbiginnovationlabs.com/bioinks-the-secret-sauce-of-bioprinting-for-building-your-tissues/",
    date: "Nov 20, 2023",
    tags: ["Bioinks"],
  },
];

export default function RecentBlogs() {
  return (
    <section
      id="recent"
      aria-labelledby="recent-heading"
      className="scroll-mt-24 bg-[var(--color-canvas)] py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-10 lg:mb-14">
          <h2
            id="recent-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            From the NBIL blog
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <GlassBlogCard
              key={post.href}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              href={post.href}
              external={!post.internal}
              date={post.date}
              readTime={post.readTime}
              tags={post.tags}
              author={{ name: "Next Big Innovation Labs®" }}
              ctaLabel="Read article"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
