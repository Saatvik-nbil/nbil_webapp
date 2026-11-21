/**
 * Outside coverage of NBIL and the founders' talks, shared by the home page
 * (a featured few) and /news (everything). Newest first. Outlet, date and
 * headline are as published; `note` is a short factual line on what the
 * piece covers.
 */
export type Press = {
  outlet: string;
  date: string;
  title: string;
  note: string;
  href: string;
  /** Shown in the home page's "Recognised where it counts" section. */
  featured?: boolean;
};

export const PRESS: Press[] = [
  {
    outlet: "Exceptional Technology",
    date: "November 2026",
    title: "Printing with living cells: inside Next Big Innovation Labs, the Bengaluru startup building India's homegrown 3D bioprinters",
    note: "A feature on the company's ten-year path and Trivima, India's first customisable bioprinter, designed and built in-house.",
    href: "https://exceptional.technology/next-big-innovation-labs-trivima-bioprinter-bengaluru/",
  },
  {
    outlet: "The Innovator",
    date: "March 2025",
    title: "Startup Of The Week: Next Big Innovation Labs (NBIL)",
    note: "A profile of the company's bioprinting platform, its backers and the ambition to move bioprinted tissue from drug testing toward the clinic.",
    href: "https://theinnovator.news/startup-of-the-week-next-big-innovation-labs-nbil/",
    featured: true,
  },
  {
    outlet: "3D Printing Industry",
    date: "December 2023",
    title: "NBIL's vision to 3D print the future of medicine, one cell at a time",
    note: "An interview on the Trivima series and NBIL's partnerships with Indian research institutions in tissue engineering and regenerative medicine.",
    href: "https://3dprintingindustry.com/news/interview-nbils-vision-to-3d-print-the-future-of-medicine-one-cell-at-a-time-227069/",
  },
  {
    outlet: "The Times of India",
    date: "November 2023",
    title: "Developing printers to print organ tissues",
    note: "Sharad Kohli on the three founders behind NBIL, one of three Indian ventures picked as World Economic Forum technology pioneers that year.",
    href: "https://timesofindia.indiatimes.com/business/startups/companies/developing-printers-to-print-organ-tissues/articleshow/105226703.cms",
    featured: true,
  },
  {
    outlet: "Manufactur3D",
    date: "June 2023",
    title: "Bioprinting startup Next Big Innovation Labs named a World Economic Forum Technology Pioneer 2023",
    note: "NBIL as the only Indian deep-tech company in the Forum's 2023 Technology Pioneers cohort.",
    href: "https://manufactur3dmag.com/nbil-world-economic-forum-technology-pioneer/",
  },
  {
    outlet: "World Economic Forum",
    date: "2023",
    title: "Next Big Innovation Labs",
    note: "The Forum's own profile of the company, named to its Technology Pioneers community for a customisable bioprinter aimed at the organ transplant gap.",
    href: "https://www.weforum.org/organizations/next-big-innovation-labs/",
    featured: true,
  },
  {
    outlet: "CNBC-TV18, Young Turks",
    date: "2023",
    title: "World Economic Forum startups: India's tech pioneers",
    note: "Young Turks on the Indian startups named World Economic Forum Technology Pioneers, NBIL among them.",
    href: "https://www.cnbctv18.com/videos/young-turks/world-economic-forum-startups-india-tech-pioneers-17358421.htm",
    featured: true,
  },
  {
    outlet: "3DHeals",
    date: "August 2022",
    title: "Piyush Padmanabhan: Bioprinting in India",
    note: "Piyush on his route into bioprinting, building India's first customised 3D bioprinter and the hurdles of precision hardware for tissue engineering.",
    href: "https://3dheals.com/interview-piyush-padmanabhan-nextbig-innovation-lab/",
  },
  {
    outlet: "Autodesk",
    date: "May 2020",
    title: "How bioprinting skin could end animal testing and improve transplants",
    note: "How NBIL bioprints human skin, Innoskin, as an alternative to animal testing and a future option for skin grafts.",
    href: "https://www.autodesk.com/design-make/articles/bioprinting-skin",
    featured: true,
  },
  {
    outlet: "BioSpectrum Asia",
    date: "January 2019",
    title: "Two Indian startups make it to Merck's innovation centre",
    note: "NBIL selected for Merck's accelerator programme for its 3D bioprinting platform and bioprinted skin, InnoSkin.",
    href: "https://www.biospectrumasia.com/news/49/12550/two-indian-startups-make-it-to-mercks-innovation-centre.html",
    featured: true,
  },
  {
    outlet: "The Hans India",
    date: "March 2018",
    title: "This startup bioprints 3D skin",
    note: "An early look at NBIL's work on bioprinted skin for cosmetic and pharmaceutical testing.",
    href: "https://www.thehansindia.com/posts/index/business/2018-03-25/this-startup-bioprints-3d-skin/369243",
  },
  {
    outlet: "YourStory",
    date: "July 2017",
    title: "Next Big Innovation Labs takes a big step with govt grants",
    note: "The early story: a Karnataka government grant, incubation at the Bangalore Bioinnovation Centre, and version one of the bioprinter in final testing.",
    href: "https://yourstory.com/2017/07/next-big-innovation-labs-biotech-startup-3d-bioprinter-government-grants",
  },
];

export const FEATURED_PRESS = PRESS.filter((p) => p.featured);

/** Podcast features and talks on YouTube. */
export type Video = {
  id: string;
  title: string;
  source: string;
  /** Who is on screen, for the caption. */
  speakers: string;
  /** Shown beside the citations on the home page. */
  featured?: boolean;
};

export const VIDEOS: Video[] = [
  {
    id: "nnh2U3aMQaM",
    title: "NBIL: Advancing 3D bioprinting through innovation and strategy",
    source: "YourStory, Money Matters",
    speakers: "Pooja Venkatesh and Piyush Padmanabhan",
    featured: true,
  },
  {
    id: "YxpZTNFlVAQ",
    title: "Food, medicine, and the 3D bioprinting revolution",
    source: "INKtalks",
    speakers: "Alok Medikepura Anil",
    featured: true,
  },
  {
    id: "IK8dIz7xxGg",
    title: "Revolutionising healthcare with Next Big Innovation Labs",
    source: "CNBC-TV18",
    speakers: "Pooja Venkatesh",
  },
  {
    id: "90fK44sd-yQ",
    title: "Transforming bioprinting: insights from Piyush, CEO of Next Big Innovation Labs",
    source: "India Innovates Podcast",
    speakers: "Piyush Padmanabhan",
  },
  {
    id: "bppozfLBVr0",
    title: "3D printed organs",
    source: "Ones Changing The World",
    speakers: "Piyush Padmanabhan",
  },
  {
    id: "YM7J-KcMJuY",
    title: "NBIL has used Fusion 360 to develop India's first commercial 3D bioprinter (Trivima)",
    source: "Autodesk Fusion",
    speakers: "The NBIL team",
  },
  {
    id: "7rTGcRriepI",
    title: "About Next Big Innovation Labs",
    source: "NBIL",
    speakers: "The NBIL team",
  },
];

export const FEATURED_VIDEOS = VIDEOS.filter((v) => v.featured);
