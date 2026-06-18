// Trivima bioprinter catalog — full machine data scraped from
// nextbiginnovationlabs.com (Next Big Innovation Labs / NBIL).
// Each record mirrors the manufacturer's published specs verbatim.

export type SpecItem = { label: string; value: string };
export type StatItem = { label: string; value: string; unit?: string };
export type Application = { title: string; description: string };
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
  /** Notable institutions / validation, where published */
  validation?: string;
  sourceUrl: string;
};

export const machines: Machine[] = [
  {
    slug: "trivima-mini",
    name: "Trivima Mini",
    fullName: "Trivima Mini Bioprinter",
    tagline: "India's smallest bioprinter, built for tight budgets and tighter benches.",
    blurb:
      "A portable, single-extruder benchtop printer for labs facing funding or space constraints.",
    overview:
      "India's compact powerhouse designed to revolutionize your approach to tissue engineering and regenerative medicine. The Mini distills pneumatic micro-extrusion into a 5.7 kg benchtop unit that installs in minutes, making it the natural entry point for teaching labs and early-stage research where every square inch and every rupee counts.",
    tier: "Entry",
    role: "Compact entry system",
    year: "2024",
    heroImage: { src: "/images/mini-1.png", alt: "Trivima Mini benchtop bioprinter" },
    images: [
      { src: "/images/mini-1.png", alt: "Trivima Mini benchtop bioprinter, front view" },
      { src: "/images/mini-2.png", alt: "Trivima Mini bioprinter, detail view" },
    ],
    stats: [
      { label: "Build volume", value: "60×60×30", unit: "mm" },
      { label: "Weight", value: "5.7", unit: "kg" },
      { label: "Extruders", value: "1" },
      { label: "Pressure", value: "0.1–4", unit: "Bar" },
    ],
    specs: [
      { label: "Extruder technology", value: "Pneumatic micro-extrusion" },
      { label: "Number of extruders", value: "1" },
      { label: "Extruder volumes", value: "3CC or 5CC" },
      { label: "Extruder temperature", value: "Room temperature to 45 °C" },
      { label: "Build volume (L×B×H)", value: "60 × 60 × 30 mm" },
      { label: "Pressure range", value: "0.1 to 4 Bar" },
      { label: "Photo-crosslinking", value: "User defined (standard: 405 nm)" },
      { label: "Outer dimensions (L×B×H)", value: "36 × 25 × 30 cm" },
      { label: "Weight", value: "5.7 kg" },
      { label: "Compatible file formats", value: ".stl, .obj, .gcode, .amf" },
    ],
    features: [
      "Pneumatic extrusion technology",
      "Single-extruder design",
      "Portable and economical",
      "Simple, fast operation",
      "Benchtop form factor",
      "Effortless installation",
      "Wide biomaterial compatibility",
    ],
    technologies: ["Pneumatic micro-extrusion", "Photo-crosslinking (405 nm standard)"],
    applications: [
      { title: "Tissue engineering", description: "Foundational scaffold and construct printing for teaching and research labs." },
      { title: "Regenerative medicine", description: "Cell-laden hydrogel deposition for early-stage regenerative studies." },
      { title: "Scaffold creation", description: "Reproducible porous scaffolds across a wide range of biomaterials." },
      { title: "Cell-based research", description: "Accessible platform for protocol development with diverse cell types." },
    ],
    software: "Dhee by NBIL",
    validation:
      "Tested over 8 years in-house and at institutions including IIT Hyderabad and AIIMS New Delhi with diverse cell types.",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-mini-bioprinter/",
  },
  {
    slug: "trivima-basic",
    name: "Trivima Basic",
    fullName: "Trivima Basic Bioprinter",
    tagline: "Dual-extruder fundamentals for first steps into bioprinting.",
    blurb:
      "Heated dual-extruder system with HEPA + UV sterility, built for beginners.",
    overview:
      "The ideal choice for beginners entering the world of bioprinting. The Basic pairs a heated dual-extruder system with visible and UV photo-crosslinking and a sterile enclosure, giving new labs a complete, self-contained workflow for soft- and hard-tissue scaffolds without specialist setup.",
    tier: "Foundational",
    role: "Dual-extruder starter",
    year: "2024",
    heroImage: { src: "/images/basic-1.webp", alt: "Trivima Basic dual-extruder bioprinter" },
    images: [
      { src: "/images/basic-1.webp", alt: "Trivima Basic bioprinter with dual extruders" },
      { src: "/images/basic-2.webp", alt: "Trivima Basic bioprinter, alternate view" },
    ],
    stats: [
      { label: "Build volume", value: "130×80×50", unit: "mm" },
      { label: "Extruder slots", value: "2" },
      { label: "Bed temp", value: "RT–80", unit: "°C" },
      { label: "Pressure", value: "0.1–8", unit: "Bar" },
    ],
    specs: [
      { label: "Extruder technology", value: "Pneumatic micro-extrusion" },
      { label: "Number of extruder slots", value: "2" },
      { label: "Extruder volumes", value: "3CC or 5CC (non-swappable, upgradeable)" },
      { label: "Extruder temperature", value: "Room temperature to 60 °C" },
      { label: "Build volume (L×B×H)", value: "130 × 80 × 50 mm (customizable)" },
      { label: "Bed temperature", value: "Room temperature to 80 °C" },
      { label: "Pressure range", value: "0.1 to 8 Bar" },
      { label: "Photo-crosslinking", value: "UV & visible (user-defined wavelengths)" },
      { label: "In-built sterility", value: "H14 HEPA filter & germicidal UV lamp" },
      { label: "Outer dimensions (L×B×H)", value: "66 × 77 × 82 cm" },
      { label: "Control software", value: "Niyantranam by NBIL" },
      { label: "Compatible file formats", value: ".stl, .obj, .gcode, .amf" },
    ],
    features: [
      "Heated dual-extruder system for bioceramics and synthetic polymers",
      "Visible and UV photo-crosslinking",
      "Heated print bed for temperature-sensitive materials",
      "Sterile enclosure with HEPA filtration and UV germicidal lamp",
      "User-friendly interface for beginners",
    ],
    technologies: [
      "Pneumatic micro-extrusion",
      "Visible-light crosslinking",
      "UV-light crosslinking",
    ],
    applications: [
      { title: "Soft-tissue scaffolds", description: "Natural hydrogel constructs for soft-tissue bioprinting." },
      { title: "Hard-tissue scaffolds", description: "Bioceramic and synthetic-polymer scaffolds for hard-tissue work." },
      { title: "Material exploration", description: "Compatible with bioceramics, natural hydrogels, and synthetic polymers." },
    ],
    software: "Niyantranam by NBIL",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-basic-bioprinter/",
  },
  {
    slug: "trivima-advanced",
    name: "Trivima Advanced",
    fullName: "Trivima Advanced Bioprinter",
    tagline: "Three extruders, coaxial printing, and well-plate workflows.",
    blurb:
      "Triple-extruder platform combining pneumatic, pellet, motor and inkjet with coaxial printing.",
    overview:
      "Elevate your bioprinting with Trivima Advanced, designed for intermediate-level researchers. Three swappable extruders span pneumatic, pellet, motor-driven and inkjet technologies, adding coaxial lumen printing and well-plate workflows on a larger build envelope than the Basic.",
    tier: "Intermediate",
    role: "Multi-technology workhorse",
    year: "2024",
    heroImage: { src: "/images/advanced-1.webp", alt: "Trivima Advanced triple-extruder bioprinter" },
    images: [
      { src: "/images/advanced-1.webp", alt: "Trivima Advanced bioprinter with three extruders" },
      { src: "/images/advanced-2.webp", alt: "Trivima Advanced bioprinter, alternate view" },
    ],
    stats: [
      { label: "Build volume", value: "130×80×80", unit: "mm" },
      { label: "Extruder slots", value: "3" },
      { label: "Pellet temp", value: "RT–250", unit: "°C" },
      { label: "Bed temp", value: "4–80", unit: "°C" },
    ],
    specs: [
      { label: "Extruder slots", value: "3" },
      { label: "Extruder volumes", value: "3CC and 5CC (swappable; upgradeable to 10CC)" },
      { label: "Pneumatic extruder temperature", value: "8 °C to 60 °C" },
      { label: "Pellet extruder temperature", value: "Room temperature to 250 °C" },
      { label: "Motor-based extruder temperature", value: "Room temperature to 60 °C" },
      { label: "Inkjet extruder temperature", value: "Room temperature to 90 °C" },
      { label: "Pressure range", value: "0.1 to 8 Bar" },
      { label: "Bed temperature", value: "4 °C to 80 °C" },
      { label: "Build volume (L×B×H)", value: "130 × 80 × 80 mm (customizable)" },
      { label: "Outer dimensions (L×B×H)", value: "66 × 77 × 82 cm" },
      { label: "Photo-crosslinking", value: "UV & visible (user-defined wavelengths)" },
      { label: "Co-axial compatibility", value: "Yes (user-defined)" },
      { label: "Control software", value: "Niyantranam by NBIL" },
      { label: "Compatible file formats", value: ".stl, .obj, .gcode, .amf" },
    ],
    features: [
      "Swappable heads for flexible extruder configuration",
      "Triple-extruder system supporting multiple materials",
      "Dual-mode temperature control (8–60 °C head; 4–80 °C bed)",
      "H14 HEPA filtration for built-in sterility",
      "Germicidal UV lamp for industry-grade sterilization",
      "Stainless steel inner chamber",
      "Multi-material printing of up to three cell types simultaneously",
      "Coaxial bioprinting for hollow, tubular structures",
      "Well-plate printing across slides, petri dishes and custom substrates",
      "Modular and upgradeable design",
    ],
    technologies: [
      "Pneumatic extrusion",
      "Pellet-based extrusion",
      "Motor-driven extrusion",
      "Inkjet (drop-on-demand)",
      "Coaxial printing",
    ],
    applications: [
      { title: "Organoid development", description: "Reproducible organoid arrays with consistent geometry." },
      { title: "Soft-tissue engineering", description: "Multi-material soft-tissue constructs from up to three cell types." },
      { title: "Novel biomaterial testing", description: "A flexible testbed for emerging bioink chemistries." },
      { title: "Lumen printing", description: "Coaxial vascular structures, nerves and ducts." },
      { title: "Complex tissue architectures", description: "Layered constructs such as liver and cornea models." },
      { title: "Disease modeling", description: "Physiologically relevant models for regeneration research." },
    ],
    fixtures: ["Slides", "Petri dishes", "Well plates", "Custom substrates"],
    software: "Niyantranam by NBIL",
    validation: "In use at Manipal University (MAHE) and SASTRA University, Thanjavur.",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-advanced-bioprinter/",
  },
  {
    slug: "trivima-pro",
    name: "Trivima Pro",
    fullName: "Trivima Pro Bioprinter",
    tagline: "Up to six extruders for the most demanding biofabrication.",
    blurb:
      "Six-slot, multi-technology flagship with quad-axial printing and 0.5 nL inkjet precision.",
    overview:
      "Unleash the full potential of bioprinting with Trivima Pro, crafted for the most demanding research applications. A high-end benchtop system with four to six configurable extruders spanning pneumatic, inkjet, pellet and motor-driven technologies, supporting well-plate, insert, triaxial and quad-axial printing alongside FRESH mode.",
    tier: "Flagship",
    role: "Six-extruder research flagship",
    year: "2024",
    featured: true,
    heroImage: { src: "/images/pro-1.webp", alt: "Trivima Pro six-extruder bioprinter" },
    images: [
      { src: "/images/pro-1.webp", alt: "Trivima Pro bioprinter with six extruders" },
      { src: "/images/pro-2.png", alt: "Trivima Pro bioprinter, alternate view" },
    ],
    stats: [
      { label: "Build volume", value: "150×100×100", unit: "mm" },
      { label: "Extruder slots", value: "4–6" },
      { label: "Inkjet precision", value: "0.5", unit: "nL" },
      { label: "Pellet temp", value: "RT–250", unit: "°C" },
    ],
    specs: [
      { label: "Extruder slots", value: "4 to 6 (user-configurable)" },
      { label: "Extruder volumes", value: "3CC, 5CC, 10CC, 30CC" },
      { label: "Extruder technologies", value: "Pneumatic, pellet-based, motor-driven, inkjet (DoD)" },
      { label: "Pneumatic temperature", value: "8 °C to 60 °C" },
      { label: "Pellet extruder temperature", value: "Room temperature to 250 °C" },
      { label: "Motor-based extruder temperature", value: "Room temperature to 60 °C" },
      { label: "Inkjet extruder temperature", value: "Room temperature to 90 °C" },
      { label: "Inkjet precision", value: "0.5 nL dispensation" },
      { label: "Bed temperature", value: "4 °C to 80 °C" },
      { label: "Pressure range", value: "0.1 to 8 Bar" },
      { label: "Build volume (L×B×H)", value: "150 × 100 × 100 mm (customizable)" },
      { label: "Outer dimensions (L×B×H)", value: "90 × 120 × 70 cm" },
      { label: "Photo-crosslinking", value: "UV & visible (user-defined wavelengths)" },
      { label: "In-built sterility", value: "H14 HEPA & germicidal UV" },
      { label: "Control software", value: "Niyantranam by NBIL" },
      { label: "Compatible file formats", value: ".stl, .obj, .gcode, .amf" },
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
    software: "Niyantranam by NBIL",
    sourceUrl: "https://nextbiginnovationlabs.com/trivima-pro-bioprinter/",
  },
  {
    slug: "trivima-np",
    name: "Trivima NP",
    fullName: "Trivima Non-Planar (NP) Bioprinter",
    tagline: "Finally, a bioprinter that matches the geometry of biology.",
    blurb:
      "Non-planar system that prints on rotary scaffolds and curved geometries instead of flat layers.",
    overview:
      "A compact, precision-built system designed for adaptable, high-performance biofabrication. The NP replaces the stationary flat bed with a rotatory spindle module, letting the extruder traverse a revolving mandrel to deposit bioink along true cylindrical and helical paths. This eliminates the layer-seam stress of flat-bed approaches and enables tubular, curved and anatomically complex constructs in a body compact enough for a biosafety cabinet.",
    tier: "Specialised",
    role: "Non-planar / rotary",
    year: "2025",
    featured: true,
    heroImage: { src: "/images/np-side.png", alt: "Trivima NP non-planar bioprinter, side view" },
    images: [
      { src: "/images/np-side.png", alt: "Trivima NP non-planar bioprinter, side view" },
      { src: "/images/np-front.png", alt: "Trivima NP non-planar bioprinter, front view" },
    ],
    stats: [
      { label: "Movement precision", value: "<10", unit: "µm" },
      { label: "Build volume", value: "120×70×50", unit: "mm" },
      { label: "Pressure", value: "0.02–8", unit: "Bar" },
      { label: "Pellet temp", value: "RT–250", unit: "°C" },
    ],
    specs: [
      { label: "Extruder slots", value: "2–3 slots (user-configurable)" },
      { label: "Pneumatic extruder volumes", value: "3CC, 5CC, 10CC" },
      { label: "Pneumatic extruder temperature", value: "8 °C to 65 °C" },
      { label: "Pellet extruder temperature", value: "Room temperature to 250 °C" },
      { label: "Motor-based extruder temperature", value: "Room temperature to 60 °C" },
      { label: "Bed temperature", value: "4 °C to 80 °C (liquid-based cooling)" },
      { label: "Pressure range", value: "0.02 to 8 Bar" },
      { label: "Build volume (L×B×H)", value: "120 × 70 × 50 mm (customizable)" },
      { label: "Movement precision", value: "<10 microns" },
      { label: "Photo-crosslinking", value: "UV & visible (user-defined wavelengths)" },
      { label: "Standard wavelengths", value: "365 nm, 405 nm, 420 nm, 520 nm" },
      { label: "Print bed type", value: "Stationary" },
      { label: "Compatible file formats", value: ".stl, .obj, .gcode, .amf" },
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
    software: "Dhee by NBIL",
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
    heroImage: { src: "/images/aura-front.png", alt: "Trivima Aura MSLA resin bioprinter" },
    images: [
      { src: "/images/aura-front.png", alt: "Trivima Aura MSLA bioprinter, front view" },
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
      { label: "Motor-based extruder temperature", value: "Room temperature to 60 °C" },
      { label: "Optical intensity", value: "Adjustable based on light engine" },
      { label: "User interface", value: "Touch screen display & external system" },
      { label: "Compatible file formats", value: ".stl, .obj, .gcode, .amf" },
      { label: "Control software", value: "Dhee by NBIL" },
    ],
    features: [
      "Compatible with commercial biomaterials and user-defined polymers",
      "In-built germicidal UV fixtures",
      "Sterilizable build platform with solvent-compatible surfaces",
      "40 µm XY resolution for precise extracellular-matrix replication",
      "Open material system — no proprietary consumables",
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
    software: "Dhee by NBIL",
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
  phone: "+91 6364 596 016",
  phoneHref: "+916364596016",
  address: {
    line1: "Jyothy Institute of Technology",
    line2: "Kanakapura Main Road, Thataguni",
    city: "Bengaluru, Karnataka 560082",
    country: "India",
  },
  site: "https://nextbiginnovationlabs.com",
} as const;
