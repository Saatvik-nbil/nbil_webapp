/**
 * Single source of truth for the company story.
 *
 * Two surfaces read this list:
 *  - `app/components/company/StoryTimeline.tsx`: the home-page horizontal
 *    scrub, which shows only `featured` entries (a short, curated arc).
 *  - `app/components/company/OurStoryLanding.tsx`: the `/our-story` page,
 *    which shows every entry including the full recognitions-and-
 *    collaborations record.
 *
 * Photos live in `/public/story_timeline`, `/public/institute` and
 * `/public/events`. Entries without an `image` fall back to the "coming soon"
 * placeholder. `fit` defaults to "cover" for photographs; use "contain" for
 * logos, certificates and award posters, which lose their point when
 * centre-cropped into the card's 16:10 frame.
 */

export type StoryCategory =
  | "Milestone"
  | "Award"
  | "Collaboration"
  | "Grant"
  | "Recognition";

export type StoryMilestone = {
  /** Stable key, also used as the timeline anchor id. */
  id: string;
  year: string;
  title: string;
  body: string;
  image?: string;
  fit?: "cover" | "contain";
  category: StoryCategory;
  /** True → also shown in the curated home-page section. */
  featured?: boolean;
};

export const STORY_MILESTONES: StoryMilestone[] = [
  {
    id: "2016-founded",
    year: "2016",
    title: "The starting line",
    body: "Founded in Bengaluru to build technology around transplant organs and bridge research and the clinic.",
    image: "/story_timeline/2016 The starting line.webp",
    category: "Milestone",
    featured: true,
  },
  {
    id: "2016-startup-india",
    year: "2016",
    title: "Recognised under Startup India",
    body: "Formally recognised under the Government of India's Startup India initiative, and under Startup Karnataka in the same year.",
    image: "/story_timeline/gov-login-img.webp",
    fit: "contain",
    category: "Recognition",
  },
  {
    id: "2017-autodesk-bbc",
    year: "2017",
    title: "Autodesk & Bangalore Bioinnovation Centre",
    body: "Collaborations with Autodesk and the Bangalore Bioinnovation Centre accelerate our design tooling and lab infrastructure.",
    image: "/story_timeline/Banglore Bioinnovation Center.webp",
    category: "Collaboration",
    featured: true,
  },
  {
    id: "2017-birac",
    year: "2017",
    title: "Grant winners: BIRAC",
    body: "Awarded a BIRAC grant by the Government of India, funding the first serious push on the extrusion platform.",
    image: "/story_timeline/BIRAC.webp",
    fit: "contain",
    category: "Grant",
  },
  {
    id: "2017-iigp",
    year: "2017",
    title: "Grant winners: IIGP 2.0",
    body: "Selected as a grant winner in the India Innovation Growth Programme 2.0, run by the Department of Science & Technology with Lockheed Martin and Tata Trusts.",
    image: "/story_timeline/India Innovation.webp",
    fit: "contain",
    category: "Grant",
  },
  {
    id: "2017-idea2poc",
    year: "2017",
    title: "Grant winners: Idea2PoC",
    body: "Won an Idea2PoC grant from the Government of Karnataka to take the bioprinter from idea to proof of concept.",
    image: "/institute/the-karnataka-government-kannada-logo-png_seeklogo-407164.png",
    fit: "contain",
    category: "Grant",
  },
  {
    id: "2018-merck-kgaa",
    year: "2018",
    title: "Merck KGaA collaboration",
    body: "A collaboration with Merck KGaA, Germany, broadens access to biomaterials and life-science expertise.",
    image: "/story_timeline/Merk KGaA.jpeg",
    category: "Collaboration",
    featured: true,
  },
  {
    id: "2018-bioasia",
    year: "2018",
    title: "Top startup at BioAsia",
    body: "Named a top startup at BioAsia, Asia's largest life sciences and healthcare forum.",
    image: "/story_timeline/BioAsia.png",
    fit: "contain",
    category: "Recognition",
  },
  {
    id: "2019-patents",
    year: "2019",
    title: "First patents",
    body: "Two foundational bioprinting patents granted, protecting the core extrusion approach.",
    image: "/story_timeline/First Patent.webp",
    fit: "contain",
    category: "Milestone",
    featured: true,
  },
  {
    id: "2019-bengaluru-tech-summit",
    year: "2019",
    title: "Top startup at Bengaluru Tech Summit",
    body: "Recognised as a top startup at the Bengaluru Tech Summit, India's flagship technology gathering.",
    image: "/story_timeline/Bengaluru TEch Summit.avif",
    category: "Recognition",
  },
  {
    id: "2020-next-big-learning",
    year: "2020",
    title: "Next Big Learning",
    body: "A process patent for bioprinting human tissue moves the platform toward clinical relevance.",
    image: "/story_timeline/next-big-learning.webp",
    category: "Milestone",
    featured: true,
  },
  {
    id: "2021-microsoft",
    year: "2021",
    title: "Microsoft for Startups",
    body: "Selected into the Microsoft Startup Program, scaling the software and cloud workflow.",
    image: "/story_timeline/Microsoft.webp",
    fit: "contain",
    category: "Recognition",
    featured: true,
  },
  {
    id: "2021-aiims",
    year: "2021",
    title: "Collaboration with AIIMS",
    body: "A collaboration project with the All India Institute of Medical Sciences brings clinical questions directly into the design loop.",
    image: "/institute/All_India_Institute_of_Medical_Sciences,_Delhi.svg.webp",
    fit: "contain",
    category: "Collaboration",
  },
  {
    id: "2022-himedia",
    year: "2022",
    title: "HiMedia partnership",
    body: "Strategic partnership with HiMedia Laboratories expands biomaterials and reach.",
    image: "/institute/HiMedia_Logo_-1.png",
    fit: "contain",
    category: "Collaboration",
    featured: true,
  },
  {
    id: "2022-atal",
    year: "2022",
    title: "Incubated at Atal Incubation Centre",
    body: "Joined the Atal Incubation Centre, adding a second base of engineering and commercialisation support.",
    image: "/institute/aic-jitf-logo.webp",
    fit: "contain",
    category: "Milestone",
  },
  {
    id: "2023-wef",
    year: "2023",
    title: "WEF Technology Pioneer",
    body: "Named among the Top 100 Technology Pioneers by the World Economic Forum; signed an R&D MoU with the Karnataka government.",
    image: "/story_timeline/WORLD ECO.webp",
    fit: "contain",
    category: "Award",
    featured: true,
  },
  {
    id: "2023-niti-aayog",
    year: "2023",
    title: "Showcase startup for NITI Aayog",
    body: "Selected as a showcase startup for NITI Aayog, Government of India, presenting Trivima at the national innovation showcase.",
    image: "/events/4.webp",
    category: "Recognition",
    featured: true,
  },
  {
    id: "2023-aster",
    year: "2023",
    title: "Dr. Moopen's Medical Foundation",
    body: "Collaboration with Dr. Moopen's Medical Foundation, part of the Aster Research Group, connecting the platform to a working hospital network.",
    image: "/story_timeline/Moopens Institute.jpg",
    category: "Collaboration",
  },
  {
    id: "2023-defence",
    year: "2023",
    title: "Space-grade bioprinting with the Department of Defence Production",
    body: "Selected by the Department of Defence Production, Ministry of Defence, to explore space-grade bioprinting applications.",
    image: "/story_timeline/DOD.webp",
    fit: "contain",
    category: "Recognition",
  },
  {
    id: "2024-lnt",
    year: "2024",
    title: "Engineering Product of the Year",
    body: "Trivima named Engineering Product of the Year 2024 at the Digital Engineering Awards, in association with L&T Technology Services.",
    image: "/story_timeline/LandT.webp",
    fit: "contain",
    category: "Award",
    featured: true,
  },
  {
    id: "2024-dell",
    year: "2024",
    title: "Dell Startup Challenge winners",
    body: "Won the Dell Startup Challenge, recognising the engineering behind the Trivima range.",
    image: "/story_timeline/DELL.webp",
    fit: "contain",
    category: "Award",
    featured: true,
  },
  {
    id: "2024-suwon",
    year: "2024",
    title: "Collaboration with Suwon University",
    body: "A collaboration with Suwon University, South Korea, extends the research network into East Asia.",
    image: "/story_timeline/uni of suwon.png",
    fit: "contain",
    category: "Collaboration",
  },
  {
    id: "2025-nyu",
    year: "2025",
    title: "Collaboration with NYU Abu Dhabi",
    body: "A collaboration with New York University, Abu Dhabi, opens a new front in bioprinting research in the Gulf.",
    image: "/story_timeline/NYU.png",
    fit: "contain",
    category: "Collaboration",
  },
  {
    id: "today",
    year: "Today",
    title: "A full range, a community",
    body: "A focused Trivima range shipping and 600+ researchers trained through Next Big Learning.",
    category: "Milestone",
    featured: true,
  },
];

/** The curated arc shown in the home-page section. */
export const FEATURED_MILESTONES = STORY_MILESTONES.filter((m) => m.featured);

export const STORY_CATEGORIES: StoryCategory[] = [
  "Milestone",
  "Award",
  "Collaboration",
  "Grant",
  "Recognition",
];
