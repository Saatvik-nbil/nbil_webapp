/**
 * The NBIL blog, hosted here rather than linked out.
 *
 * Each post's body is a markdown file in `content/blog/`, transcribed verbatim
 * from the article as published on nextbiginnovationlabs.com: the headings,
 * their order, and the wording are the author's. `sourceUrl` records where a
 * post was originally published, for provenance.
 *
 * To add a post: drop the markdown in `content/blog/<slug>.md` (starting with
 * the title as a single `#` H1) and add an entry here. The route, the listing
 * and the sitemap all read from this array.
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Cover image. Remote covers are served as-is, so no next/image host entry. */
  image: string;
  /** Display date, as published. */
  date: string;
  /** ISO form of `date`, for metadata and structured data. */
  isoDate: string;
  tags: string[];
  readTime: string;
  /** Where this post first appeared. */
  sourceUrl?: string;
};

export const posts: BlogPost[] = [
  {
    slug: "interdisciplinary-stem-education",
    title:
      "Bioprinting and Beyond: The Future of Interdisciplinary STEM Education",
    excerpt:
      "The power of interdisciplinary learning and why blending biology, engineering and design matters for advancing science.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2025/01/Interdisciplinary-Learning.png?fit=1200%2C628&ssl=1",
    date: "Jan 10, 2025",
    isoDate: "2025-01-10",
    tags: ["Education"],
    readTime: "7 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/advancing-bioprinting-education/",
  },
  {
    slug: "bioprinting-spheroids",
    title:
      "Bioprinting Spheroids for High-Throughput Applications: Advancing Cancer Research",
    excerpt:
      "How spheroids act as 3D cell structures that mimic human tissue environments to accelerate cancer research.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/10/Bioprinting-Spheroids-for-High-Throughput-Applications-Advancing-Cancer-Research.png?fit=1200%2C628&ssl=1",
    date: "Oct 15, 2024",
    isoDate: "2024-10-15",
    tags: ["Cancer Research"],
    readTime: "8 min read",
    sourceUrl: "https://nextbiginnovationlabs.com/bioprinting-spheroids/",
  },
  {
    slug: "gelma-5-reasons",
    title: "GelMA: 5 Reasons to Choose it as Your Next Bioink for Bioprinting",
    excerpt:
      "Why Gelatin Methacryloyl (GelMA) has become one of the most versatile and widely used bioprinting materials.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/07/Gelatin-Methacryloyl-GelMA.png?fit=1200%2C628&ssl=1",
    date: "Jul 27, 2024",
    isoDate: "2024-07-27",
    tags: ["Bioinks"],
    readTime: "5 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/5-reasons-to-choose-gelma-for-bioprinting/",
  },
  {
    slug: "bioprinting-101-glossary",
    title: "Bioprinting 101: Glossary",
    excerpt:
      "A reference guide to the key terminology used across bioprinting technology, from bioinks to crosslinking.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/04/Exploring-Key-Terminologies-in-Bioprinting.png?fit=1200%2C628&ssl=1",
    date: "Apr 22, 2024",
    isoDate: "2024-04-22",
    tags: ["Guide"],
    readTime: "18 min read",
    sourceUrl: "https://nextbiginnovationlabs.com/bioprinting-101-glossary/",
  },
  {
    slug: "bioprinting-101-troubleshooting",
    title: "Bioprinting 101: Troubleshooting Common Challenges and Solutions",
    excerpt:
      "Practical fixes for the most common bioprinting problems, from needle collisions and air bubbles to cell viability and scaffold integrity.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/04/Troubleshooting-Common-Bioprinting-Challenges-and-Solutions.png?fit=1200%2C628&ssl=1",
    date: "Apr 15, 2024",
    isoDate: "2024-04-15",
    tags: ["Troubleshooting"],
    readTime: "9 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/bioprinting-101-troubleshooting-common-challenges-and-solutions/",
  },
  {
    slug: "trivima-mini-and-pm-modi",
    title: "Trivima Mini and Prime Minister Modi",
    excerpt:
      "How Next Big Innovation Labs' Trivima Mini bioprinter was showcased to Prime Minister Narendra Modi at India's National Technology Week.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/03/Bioprinting-in-Space-Bioprinting-in-Zero-G-2.png?fit=1200%2C628&ssl=1",
    date: "Mar 21, 2024",
    isoDate: "2024-03-21",
    tags: ["News"],
    readTime: "6 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/trivima-mini-and-prime-minister-modi/",
  },
  {
    slug: "bioprinting-in-space",
    title: "Bioprinting in Space: Bioprinting in Zero G",
    excerpt:
      "Exploring how bioprinting operates in microgravity, and the collaborations shaping tissue engineering beyond Earth.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/03/Bioprinting-in-Space-Bioprinting-in-Zero-G.png?fit=1200%2C628&ssl=1",
    date: "Mar 11, 2024",
    isoDate: "2024-03-11",
    tags: ["Research"],
    readTime: "6 min read",
    sourceUrl: "https://nextbiginnovationlabs.com/bioprinting-in-space-zero-g/",
  },
  {
    slug: "biomaterials-top-5",
    title: "Biomaterials for Bioprinting: Top 5 Materials!",
    excerpt:
      "Five biomaterials reshaping tissue engineering, from GelMA and sodium alginate to collagen and Pluronic F127.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/03/Biomaterials-for-Bioprinting-TOP-5-MATERIALS-.png?fit=1200%2C628&ssl=1",
    date: "Mar 11, 2024",
    isoDate: "2024-03-11",
    tags: ["Biomaterials"],
    readTime: "9 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/biomaterials-for-bioprinting-top-5-materials/",
  },
  {
    slug: "3d-printing-or-bioprinting",
    title: "3D Printing or Bioprinting? Navigating the Difference",
    excerpt:
      "How bioprinting builds on conventional 3D printing by using living cells and biocompatible materials to create functional tissue.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2024/02/3D-Printing-or-3D-Bioprinting-by-NBIL.png?fit=1200%2C628&ssl=1",
    date: "Feb 7, 2024",
    isoDate: "2024-02-07",
    tags: ["Guide"],
    readTime: "4 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/3d-printing-or-bioprinting-navigating-the-difference/",
  },
  {
    slug: "bioinks-secret-sauce",
    title: "Bioinks: The Secret Sauce of Bioprinting, for Building Your Tissues",
    excerpt:
      "Why bioinks (the formulated blend of cells, biomaterials and nutrients) sit at the heart of every successful bioprint.",
    image:
      "https://i0.wp.com/nextbiginnovationlabs.com/wp-content/uploads/2023/11/Bioink-Next-Big-Innovation-Labs.png?fit=1200%2C628&ssl=1",
    date: "Nov 20, 2023",
    isoDate: "2023-11-20",
    tags: ["Bioinks"],
    readTime: "5 min read",
    sourceUrl:
      "https://nextbiginnovationlabs.com/bioinks-the-secret-sauce-of-bioprinting-for-building-your-tissues/",
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
