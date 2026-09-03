// Trivima bioprinter catalog: full machine data scraped from
// nextbiginnovationlabs.com (Next Big Innovation Labs / NBIL).
// Each record mirrors the manufacturer's published specs verbatim.

export type SpecItem = { label: string; value: string };
export type StatItem = { label: string; value: string; unit?: string };
export type Application = {
  title: string;
  description: string;
  /** Photo for the application card. Cards without one show the "image coming
      soon" placeholder, so entries can ship before the photography does. */
  image?: string;
};
export type MachineImage = { src: string; alt: string };

export type Machine = {
  slug: string;
  name: string;
  fullName: string;
  /** One-line positioning shown under the name */
  tagline: string;
  /** Short descriptor used on catalog cards */
  blurb: string;
  /** Long-form overview paragraph(s) */
  overview: string;
  /** Tier label for the catalog ("Entry", "Specialised", ...) */
  tier: string;
  /** Headline word for the hero eyebrow / family role */
  role: string;
  /** Release year badge */
  year: string;
  /** Sort + display accent */
  featured?: boolean;
  heroImage: MachineImage;
  images: MachineImage[];
  /** 3–4 standout numbers for the card + hero */
  stats: StatItem[];
  /** Full technical specification table */
  specs: SpecItem[];
  features: string[];
  technologies: string[];
  applications: Application[];
  /** Compatible bed fixtures / substrates (where published) */
  fixtures?: string[];
  software: string;
  /** The control suite's own page, where it has one. Render sites link the
      software name through this so every Dhee mention reaches /dhee-slicer. */
  softwareHref?: string;
  /** What a lab can specify before the machine is built.
   *
   *  Configurability is the range's main selling point, so every surface that
   *  sells a model reads this instead of re-wording it: the catalog row, the
   *  model page, the comparison table. Each entry below is drawn from the
   *  machine's own published `specs` and `features` (the "user-configurable",
   *  "customizable" and "user-defined" lines), not from anything new. */
  customisation?: {
    /** One line, used on cards and in section copy. */
    summary: string;
    /** The specific choices a lab makes with us. */
    options: string[];
  };
  /** Notable institutions / validation, where published */
  validation?: string;
  sourceUrl: string;
};

export const machines: Machine[] = [
  {
    slug: "trivima-pro",
    name: "Trivima Pro",
    fullName: "Trivima Pro Bioprinter",
    tagline: "Up to six extruders for the most demanding biofabrication.",
    blurb:
      "Six-slot, multi-technology flagship with quad-axial printing and 0.5 nL inkjet precision.",
    overview:
      "Unleash the full potential of bioprinting with Trivima Pro, crafted for the most demanding research applications. A high-end benchtop system with four to six configurable extruders spanning pneumatic, inkjet, pellet and motor-driven technologies, supporting well-plate, insert, triaxial and quad-axial printing alongside FRESH mode.",
    tier: "Customisable",
    role: "Six-extruder research flagship",
    year: "2024",
    featured: true,
    heroImage: { src: "/images/pro-1.webp", alt: "Trivima Pro six-extruder bioprinter" },
    images: [
      { src: "/images/pro-1.webp", alt: "Trivima Pro bioprinter with six extruders" },
    ],
    stats: [
      { label: "Build volume", value: "150×100×100", unit: "mm" },
      { label: "Extruder slots", value: "4–6" },
      { label: "Inkjet precision", value: "0.5", unit: "nL" },
      { label: "Pellet temp", value: "Ambient–250", unit: "°C" },
    ],
    specs: [
      { label: "Extruder slots", value: "4 to 6 (user-configurable)" },
      { label: "Extruder volumes", value: "3CC, 5CC, 10CC, 30CC" },
      { label: "Extruder technologies", value: "Pneumatic, pellet-based, motor-driven, inkjet (DoD)" },
      { label: "Pneumatic temperature", value: "8 °C to 60 °C" },
      { label: "Pellet extruder temperature", value: "Ambient temperature to 250 °C" },
      { label: "Motor-based extruder temperature", value: "Ambient temperature to 60 °C" },
      { label: "Inkjet extruder temperature", value: "Ambient temperature to 90 °C" },
      { label: "Inkjet precision", value: "0.5 nL dispensation" },
      { label: "Bed temperature", value: "4 °C to 80 °C" },
      { label: "Pressure range", value: "0.02 to 8 Bar" },
      { label: "Build volume (L×B×H)", value: "150 × 100 × 100 mm (customizable)" },
      { label: "Outer dimensions (L×B×H)", value: "90 × 120 × 70 cm" },
      { label: "Photo-crosslinking", value: "UV & visible (user-defined wavelengths)" },
      { label: "In-built sterility", value: "H14 HEPA & germicidal UV" },
      { label: "Control software", value: "Dhee by NBIL" },
      { label: "Compatible file formats", value: ".stl, .gcode" },
    ],
    features: [
      "Swappable heads across all extruder slots",
      "Four to six extruders, user-configurable",
      "Compatible with pneumatic print heads plus additional technologies",
      "H14 HEPA filtration with germicidal UV sterilization",
      "Stainless steel inner chamber",
      "Sturdy benchtop design",
      "Co-axial, tri-axial and quad-axial printing compatibility",
      "FRESH printing mode support",
      "Well-plate, petri dish, slide, insert and custom-substrate fixtures",
    ],
    technologies: [
      "Pneumatic extrusion",
      "Inkjet (drop-on-demand)",
      "Pellet-based extrusion",
      "Motor-driven extrusion",
      "Co-axial printing",
      "Tri-axial printing",
      "Quad-axial printing",
      "FRESH printing",
    ],
    applications: [
      { title: "Organoid & spheroid printing", description: "Precise formation of organoids and spheroids for disease models." },
      { title: "Multi-material scaffolds", description: "Complex constructs with graded properties for biomaterial research." },
      { title: "Complex tissue engineering", description: "Multiple cell types integrated into a single native-like construct." },
      { title: "Research-driven applications", description: "From pioneering treatments to biological science and food technology." },
    ],
    fixtures: ["Well plates", "Petri dishes", "Slides", "Inserts", "Custom substrates"],
    customisation: {
      summary:
        "Specified with you before it is built: how many extruders, which technologies sit in them, and how big the build volume needs to be.",
      options: [
        "Four to six extruder slots, user-configurable",
        "Pneumatic, inkjet, pellet and motor-driven heads in any combination",
        "Build volume beyond the standard 150 × 100 × 100 mm",
        "Co-axial, tri-axial and quad-axial configurations",
        "Crosslinking at user-defined UV and visible wavelengths",
        "Well plate, petri dish, slide, insert and custom substrate fixtures",
      ],
    },
    software: "Dhee by NBIL",
    softwareHref: "/dhee-slicer",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-pro-bioprinter/",
  },
  {
    slug: "trivima-np",
    name: "Trivima NP",
    fullName: "Trivima Non-Planar (NP) Bioprinter",
    tagline: "Finally, a bioprinter that matches the geometry of biology. With a 4th axis",
    blurb:
      "Non-planar system that prints on rotary scaffolds and curved geometries instead of flat layers.",
    overview:
      "A compact, precision-built system designed for adaptable, high-performance biofabrication. The NP replaces the stationary flat bed with a rotatory spindle module, letting the extruder traverse a revolving mandrel to deposit bioink along true cylindrical and helical paths. This eliminates the layer-seam stress of flat-bed approaches and enables tubular, curved and anatomically complex constructs in a body compact enough for a biosafety cabinet.",
    tier: "Customisable",
    role: "Non-planar",
    year: "2025",
    featured: true,
    heroImage: { src: "/images/np-side.webp", alt: "Trivima NP non-planar bioprinter, side view" },
    images: [
      { src: "/images/np-side.webp", alt: "Trivima NP non-planar bioprinter, side view" },
      { src: "/images/np-front.webp", alt: "Trivima NP non-planar bioprinter, front view" },
    ],
    stats: [
      { label: "Movement precision", value: "<10", unit: "µm" },
      { label: "Build volume", value: "120×70×50", unit: "mm" },
      { label: "Pressure", value: "0.02–8", unit: "Bar" },
      { label: "Bed temp", value: "Ambient–80", unit: "°C" },
    ],
    specs: [
      { label: "Extruder slots", value: "2–3 slots (user-configurable)" },
      { label: "Pneumatic extruder volumes", value: "3CC, 5CC, 10CC" },
      { label: "Pneumatic extruder temperature", value: "8 °C to 65 °C" },
      { label: "Pellet extruder temperature", value: "Ambient temperature to 250 °C" },
      { label: "Motor-based extruder temperature", value: "Ambient temperature to 60 °C" },
      { label: "Bed temperature", value: "4 °C to 80 °C (liquid-based cooling)" },
      { label: "Pressure range", value: "0.02 to 8 Bar" },
      { label: "Build volume (L×B×H)", value: "120 × 70 × 50 mm (customizable)" },
      { label: "Movement precision", value: "<10 microns" },
      { label: "Photo-crosslinking", value: "UV & visible (user-defined wavelengths)" },
      { label: "Standard wavelengths", value: "365 nm, 405 nm, 420 nm, 520 nm" },
      { label: "Print bed type", value: "Stationary" },
      { label: "Compatible file formats", value: ".stl, .gcode" },
    ],
    features: [
      "Swappable heads with two to three extruders",
      "Rotatory spindle module for cylindrical / tubular printing",
      "Lightweight anodized aluminum body with stainless steel components",
      "Dual-extruder compatibility",
      "Integrated temperature control",
      "UV crosslinking capability",
      "Fits within biosafety cabinets",
      "Coaxial & tri-axial compatibility (user-defined)",
      "HEPA box with UV sterilization (add-on chamber)",
    ],
    technologies: [
      "Pneumatic extrusion",
      "Pellet-based extrusion",
      "Motor-driven extrusion",
      "Rotary spindle printing",
      "Photo-crosslinking (UV / visible)",
      "Coaxial printing",
      "Tri-axial printing",
    ],
    applications: [
      { title: "Vascular tissue engineering", description: "Perfusable vascular grafts with concentric walls and small-diameter blood-vessel models." },
      { title: "Respiratory & airway models", description: "Tracheal and bronchial scaffolds with uniform internal lumens." },
      { title: "Cardiovascular stents & implants", description: "Precision tubular constructs for vascular stents and implants." },
      { title: "Organoid & disease modeling", description: "Medium-throughput organoid arrays with consistent geometry." },
      { title: "Ocular & corneal constructs", description: "Hydrogel contact-lens prototypes using mold-assisted workflows." },
    ],
    fixtures: ["Slides", "Petri dishes", "Well plates", "FRESH substrate", "Well inserts", "Custom substrates"],
    customisation: {
      summary:
        "Configured around the geometry you print: two or three extruders, the heads that suit your bioink, and a build volume set with you.",
      options: [
        "Two to three extruder slots, user-configurable",
        "Pneumatic, pellet and motor-driven heads",
        "Build volume beyond the standard 120 × 70 × 50 mm",
        "Coaxial and tri-axial heads, user-defined",
        "Crosslinking at 365, 405, 420 or 520 nm",
        "HEPA and germicidal UV chamber as an add-on",
      ],
    },
    software: "Dhee by NBIL",
    softwareHref: "/dhee-slicer",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-bioprinter/trivimanpbioprinter/",
  },
  {
    slug: "trivima-aura",
    name: "Trivima Aura",
    fullName: "Trivima Aura Bioprinter",
    tagline: "A high-resolution MSLA bioprinter designed for research innovation.",
    blurb:
      "Light-based MSLA printer reaching ≤40 µm resolution for cell-laden hydrogel constructs.",
    overview:
      "A research bioprinter that combines precision, flexibility, and ease of use. Built on MSLA (masked screen LCD) technology with a 405 nm light engine, the Aura cures whole layers at once to reach ≤40 µm XY resolution, an open-material system with no proprietary consumables, designed for reproducible laboratory integration. For research use only.",
    tier: "Specialised",
    role: "Light-based / MSLA",
    year: "2025",
    heroImage: { src: "/images/aura-dlp-iso.webp", alt: "Trivima Aura MSLA resin bioprinter" },
    images: [
      { src: "/images/aura-dlp-iso.webp", alt: "Trivima Aura MSLA bioprinter, front view" },
    ],
    stats: [
      { label: "Print resolution", value: "≤40", unit: "µm" },
      { label: "Build volume", value: "80×60×100", unit: "mm" },
      { label: "Crosslinking", value: "405", unit: "nm" },
      { label: "Technology", value: "MSLA" },
    ],
    specs: [
      { label: "Technology", value: "MSLA (masked screen LCD)" },
      { label: "Print resolution", value: "≤40 microns" },
      { label: "Photo-crosslinking", value: "405 nm UV" },
      { label: "Build volume (L×B×H)", value: "80 × 60 × 100 mm" },
      { label: "Machine build", value: "Metal (stainless steel or anodized aluminium)" },
      { label: "Print bed type", value: "Glass or metal based" },
      { label: "Motor-based extruder temperature", value: "Ambient temperature to 60 °C" },
      { label: "Optical intensity", value: "Adjustable based on light engine" },
      { label: "User interface", value: "Touch screen display & external system" },
      { label: "Compatible file formats", value: ".stl, .bmp" },
      { label: "Control software", value: "Aura Slicer by NBIL" },
    ],
    features: [
      "Compatible with commercial biomaterials and user-defined polymers",
      "In-built germicidal UV fixtures",
      "Sterilizable build platform with solvent-compatible surfaces",
      "40 µm XY resolution for precise extracellular-matrix replication",
      "Open material system, no proprietary consumables",
      "Designed for laboratory integration and reproducibility",
    ],
    technologies: [
      "MSLA (masked screen LCD with LED light source)",
      "A form of DLP bioprinting using a masked screen and LCD projector",
    ],
    applications: [
      { title: "Tissue engineering & regenerative medicine", description: "Cell-laden hydrogel constructs with physiologically relevant architecture." },
      { title: "Organ-on-chip & microphysiological systems", description: "Microfluidic devices and compartmentalized tissue chambers." },
      { title: "Bioinspired materials & soft-matter physics", description: "Lattice structures, gradient materials and bio-inspired architectures." },
    ],
    customisation: {
      summary:
        "Open by design: an unrestricted material system, adjustable optics and a bed material chosen to suit your chemistry.",
      options: [
        "Optical intensity adjustable to the light engine",
        "Glass or metal print bed",
        "Stainless steel or anodized aluminium build",
        "Open material system with no proprietary consumables",
        "Commercial biomaterials or your own user-defined polymers",
      ],
    },
    software: "Aura Slicer by NBIL",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-bioprinter/trivima-aura/",
  },
];

export function getMachine(slug: string): Machine | undefined {
  return machines.find((m) => m.slug === slug);
}

export const COMPANY = {
  name: "Next Big Innovation Labs",
  short: "NBIL",
  email: "support@nextbiginnovationlabs.com",
  address: {
    line1: "No.22, 16th Cross",
    line2: "5th Phase, J.P. Nagar",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560078",
    country: "India",
  },
  site: "https://nextbiginnovationlabs.com",
} as const;

/**
 * The postal address as one line. Every surface that prints the address should
 * use this so the parts can't be reassembled differently in three places.
 * Pass `country: false` where the country is redundant.
 */
export function formatAddress({ country = true } = {}) {
  const a = COMPANY.address;
  return [
    a.line1,
    a.line2,
    `${a.city} – ${a.postalCode}`,
    country ? a.country : null,
  ]
    .filter(Boolean)
    .join(", ");
}
