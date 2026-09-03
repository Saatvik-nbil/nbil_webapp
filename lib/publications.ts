/**
 * Peer-reviewed papers whose work was done on a Trivima bioprinter.
 *
 * Everything here is taken from the PDFs in `public/publications`: the
 * abstracts are verbatim (only the PDF text layer's mangled symbols restored,
 * so ± × · µ − read correctly), and `trivimaUse` quotes how each paper names
 * and describes the machine in its own methods section. Nothing is inferred.
 *
 * `thumb` is a render of the paper's own first page, generated from the PDF.
 * `url` is the DOI, which is the stable link to the published version.
 */

export type Publication = {
  slug: string;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  /** Volume / article number line, where the paper carries one. */
  citation?: string;
  doi: string;
  url: string;
  /** Verbatim abstract as published. */
  abstract: string;
  /** How the Trivima was used, in the paper's own terms. */
  trivimaUse: string;
  /** The machine as the paper names it. */
  machine: string;
  institutions: string[];
  topics: string[];
  /** First-page render, in public/publications/thumbs. */
  thumb: string;
  /** The PDF itself, in public/publications. */
  pdf: string;
};

export const publications: Publication[] = [
  {
    slug: "pharmaceutical-polymer-hydrogels",
    title:
      "Pharmaceutical polymer-based hydrogels for 3D bioprinted drug delivery and tissue engineering applications",
    authors: [
      "Hemant Kumar Bankhede",
      "Maheswari Sivaravi",
      "Antara Poi Raiturker",
      "Prajakta Praveen Bhende",
      "Sagar B. Kale",
      "Mamta Keshav Tari",
      "Asima Shaukat",
      "Anasuya Ganguly",
    ],
    journal: "Journal of Biological Engineering",
    year: "2026",
    citation: "20:130",
    doi: "10.1186/s13036-026-00749-3",
    url: "https://doi.org/10.1186/s13036-026-00749-3",
    abstract:
      "Introduction: 3D bioprinting enables the layer-by-layer fabrication of living tissue constructs and supports patient-specific customization. This technology holds strong promises for regenerative medicine and drug discovery. However, its broader translation remains limited by material variability, safety considerations, cost constraints and regulatory requirements.\n\nBackground: This study investigates the use of safe, affordable and regulatory-compliant pharmaceutical polymers as biomaterials for 3D bioprinting. It specifically focuses on hydrogels formulated from Starch 1500®, maltodextrin and sodium alginate. The objective is to assess their potential applications in skin tissue engineering and oral drug delivery through semisolid extrusion-based 3D bioprinting techniques.\n\nResults: Ionic crosslinking of the hydrogel was confirmed by FTIR analysis. The hydrogel exhibited a viscosity of 1.56×10⁶ mPa·s, supporting semisolid extrusion bioprinting and excellent printability under ambient conditions. It enabled the fabrication of multilayer scaffolds with uniform filaments, well-defined square pore geometry and good shape fidelity. Rheological analysis showed shear-thinning behavior under applied stress, 87% thixotropic recovery and predominantly solid-like behavior at rest. Cast films showed a tensile strength of 33.9 MPa with limited extensibility, whereas lyophilized scaffolds exhibited high porosity and an average pore size of 39.2 µm. The 3D-printed scaffolds swollen upto 72% within 24 h and showed the onset of degradation after 2 weeks. Biological evaluation confirmed non-cytotoxicity, with more than 70% cell viability in skin-relevant L929 and HaCaT cells and good hemocompatibility, indicated by 5.0% hemolysis. Confocal microscopy further showed cell growth on the crosslinked hydrogel, supporting their potential for skin tissue engineering. Glimepiride-loaded bioinks were successfully formulated into chewable tablets for drug delivery, which exhibited acceptable physical properties. The tablets demonstrated excellent content uniformity (100.4%), while dissolution results showed sustained-release profiles over a time period of four hours.",
    trivimaUse:
      "Printing was performed by pneumatic, semisolid extrusion-based 3D bioprinting on a Trivima Basic, fitted with a 10 mL Luer-Lock syringe and a 22-gauge tapered tip, to build multilayer scaffolds with uniform filaments and defined square pores. The paper tabulates the Trivima printing setup and process parameters in full.",
    machine: "Trivima Basic",
    institutions: ["BITS Pilani, K K Birla Goa Campus"],
    topics: ["Skin tissue engineering", "Oral drug delivery", "Semisolid extrusion"],
    thumb: "/publications/thumbs/pharmaceutical-polymer-hydrogels.webp",
    pdf: "/publications/Bankhede_et_al-2026-Journal_of_Biological_Engineering.pdf",
  },
  {
    slug: "amyloid-nanofibril-hydrogel",
    title:
      "Extrusion-based 3D-printable amyloid nanofibril-based hydrogel: A multifunctional system for hemostasis and localized drug delivery applications",
    authors: [
      "D. A. Gouripriya",
      "Prama Adhya",
      "Arup Paul",
      "Jaideep Adhikari",
      "Pratik Das",
      "Agnibin Kundu",
      "Aditya Dev Rajora",
      "Piyali Basak",
      "Sabu Thomas",
      "Prosenjit Saha",
      "Pooja Ghosh",
    ],
    journal: "Journal of Drug Delivery Science and Technology",
    year: "2026",
    citation: "Volume 120, 108262",
    doi: "10.1016/j.jddst.2026.108262",
    url: "https://doi.org/10.1016/j.jddst.2026.108262",
    abstract:
      "Recently, amyloid nanostructures-based hydrogels are gaining prominence in biomedical research for their exceptional mechanical stability, biodegradability, and biocompatibility. Herein, we propose a novel 3D-printable amyloid nanostructures-based hydrogel that encapsulates curcumin into the fibrillar aggregates derived from bovine serum albumin (BSA), aiming to combine the inherent mechanical stability of fibril structures with curcumin's bioactive properties. The resulting composite hydrogel exhibits porous structure, well-regulated rheological characteristics with excellent injectability and 3D-printing properties. According to ABTS (2,2-azino-bis (3-ethylbenzothiazoline-6-sulfonic acid)) and 2,2-diphenyl-1-picrylhydrazyl (DPPH) radical scavenging tests, curcumin significantly enhanced the hydrogels' antioxidant activity. Furthermore, the in vitro drug release tests demonstrated a sustained release of curcumin by either swelling or diffusion, demonstrating the exceptional effectiveness of amyloid-based hydrogel as a drug delivery vehicle for curcumin. Biocompatibility and cytotoxicity of the hydrogels were evaluated through in vitro cytotoxicity assays, which confirmed no toxic effects on L929 mouse fibroblast cells, supporting the initial suitability of the hydrogel for cellular applications. Additionally, the resulting hydrogel possesses potent hemostatic capabilities, facilitating rapid blood coagulation. The amyloid nanostructures-based hydrogel emerged as a promising candidate for applications in hemostasis and localized therapeutic delivery.",
    trivimaUse:
      "The scaffolds were fabricated on an extrusion bioprinter, Trivima with a double extruder, with the hydrogels loaded into a syringe fitted with a 26-gauge nozzle (279 µm inner diameter). Printability of the curcumin-loaded amyloid hydrogel was assessed on the same system.",
    machine: "Trivima, double extruder",
    institutions: ["JIS Institute of Advanced Studies and Research, Kolkata"],
    topics: ["Hemostasis", "Drug delivery", "Amyloid hydrogels"],
    thumb: "/publications/thumbs/amyloid-nanofibril-hydrogel.webp",
    pdf: "/publications/JIS Paper 1 (1).pdf",
  },
  {
    slug: "collagen-like-protein-hydrogel",
    title:
      "3D printable collagen-like protein hydrogels via dynamic covalent assembly for soft tissue engineering",
    authors: [
      "Mercyjayapriya Jebakumar",
      "Mohandass Pachaiyappan",
      "Chayla L. Reeves",
      "Kate Fox",
      "Amy Gelmi",
      "Niraikulam Ayyadurai",
    ],
    journal: "Journal of Materials Chemistry B",
    year: "2025",
    doi: "10.1039/d5tb01716e",
    url: "https://doi.org/10.1039/d5tb01716e",
    abstract:
      "This study presents a novel 3D collagen-like protein/aldehyde-functionalized dextran (CLP−AD) hydrogel designed for tissue engineering. Developed under physiological conditions, the hydrogel forms without harsh crosslinkers or external triggers, relying on Schiff base reactions between aldehyde groups of oxidized dextran and amino groups of recombinant collagen-like protein. This dynamic covalent bonding enables a sol-to-gel transition ideal for 3D bioprinting. Comprehensive characterization confirmed its favorable gelation, swelling, degradation, and cytocompatibility profiles. Rheological analysis revealed viscoelastic and self-healing properties, making it suitable for dynamic tissue environments. Co-culture with human endothelial cells demonstrated high cell viability and migration, comparable to collagen hydrogels (RC-AD). Evaluation as a cell adhesion substrate for umbilical cord-derived mesenchymal stem cells (UC-hMSCs) revealed less spreading and fewer focal adhesions compared to the stiffer tissue culture polystyrene (TCPS) substrate, observed through immunostaining. Cell encapsulation studies with UC-hMSCs demonstrated high cell viability within the 3D matrix, supporting the hydrogel's suitability for cell-laden bioprinting applications. These findings suggest that the CLP−AD hydrogel maintains a morphology conducive to soft tissue engineering applications. This CLP overcomes the limitations associated with animal-derived collagen, such as risk of disease transmission and batch-to-batch variability. Overall, this study presents a straightforward approach for fabricating tunable and 3D-printable hydrogels, highlighting their potential for developing materials for soft tissue repair and regeneration.",
    trivimaUse:
      "The 3D printability of the CLP−AD hydrogel was tested on a pneumatic extrusion-based 3D printer, NBIL-Trivima, the step that established the animal-free collagen-like protein ink as suitable for cell-laden bioprinting.",
    machine: "NBIL-Trivima, pneumatic extrusion",
    institutions: ["CSIR Central Leather Research Institute, Chennai", "RMIT University, Melbourne"],
    topics: ["Soft tissue engineering", "Recombinant collagen", "Self-healing hydrogels"],
    thumb: "/publications/thumbs/collagen-like-protein-hydrogel.webp",
    pdf: "/publications/JMC 2.pdf",
  },
  {
    slug: "conductive-gellan-pva-cardiac",
    title:
      "An electrically conductive gellan gum/polyvinyl alcohol interpenetrating network hydrogel: a dual crosslinked 3D printing ink for cardiac tissue",
    authors: [
      "Mohandass Pachaiyappan",
      "Mercyjayapriya Jebakumar",
      "Janani Radhakrishnan",
      "Niraikulam Ayyadurai",
    ],
    journal: "Journal of Materials Chemistry B",
    year: "2025",
    doi: "10.1039/d5tb01462j",
    url: "https://doi.org/10.1039/d5tb01462j",
    abstract:
      "Biofabrication of cardiac tissue constructs with inherent electrical conductivity and contractility presents a significant challenge. In this study, an interpenetrating network (IPN) hydrogel composed of methacrylate-modified polyvinyl alcohol (M-PVA) and gellan gum (GG) reinforced with reduced graphene oxide (rGO) has been developed. The M-PVA/GG/rGO hydrogel leverages the thermoresponsive property of polysaccharide gellan gum for controlled gelation during the 3D printing process, followed by post-printing photocrosslinking of M-PVA to enhance structural stability. The IPN hydrogel exhibited porous morphology with interconnected pores, high porosity, swellability, and significant electrical conductivity (0.62 ± 0.05 mS cm⁻¹) imparted by the inclusion of rGO. Rheological analysis demonstrated the shear-thinning property and predominant elastic modulus of the developed hydrogel, thereby being suitable for pneumatic extrusion-based 3D printing. The printed constructs cultured with H9c2 cardiomyoblasts and EA.hy926 endothelial cells demonstrated favorable in vitro cell viability, proliferation, and cardiac specific gene expression, influenced by the matrix composition. The dual-crosslinked, electroconductive M-PVA/GG/rGO hydrogel shows significant promise for promoting vascularization in cardiac tissue engineering, facilitating tissue regeneration, development of organotypic models and potentially enabling the development of electroconductive biomedical devices.",
    trivimaUse:
      "A pneumatic extrusion-based 3D bioprinter, NBIL-Trivima, was used to investigate the printability of the M-PVA/GG hydrogel, running a 22-gauge needle and 3 mL syringes while extrusion pressure and printing speed were varied. Square, star, heart and circular designs were printed, then photo-crosslinked after printing.",
    machine: "NBIL-Trivima, pneumatic extrusion",
    institutions: [
      "CSIR Central Leather Research Institute, Chennai",
      "BRIC National Institute of Animal Biotechnology, Hyderabad",
    ],
    topics: ["Cardiac tissue engineering", "Conductive hydrogels", "Photo-crosslinking"],
    thumb: "/publications/thumbs/conductive-gellan-pva-cardiac.webp",
    pdf: "/publications/2025- Journal of Material Chemistry B.pdf",
  },
  {
    slug: "immunocompetent-breast-cancer-model",
    title:
      "Assessment and process optimization of high throughput biofabrication of immunocompetent breast cancer model for drug screening applications",
    authors: [
      "Priyanshu Shukla",
      "Ashis Kumar Bera",
      "Amit Ghosh",
      "Gaddam Kiranmai",
      "Falguni Pati",
    ],
    journal: "Biofabrication",
    year: "2024",
    citation: "16, 035030",
    doi: "10.1088/1758-5090/ad586b",
    url: "https://doi.org/10.1088/1758-5090/ad586b",
    abstract:
      "Recent advancements in 3D cancer modeling have significantly enhanced our ability to delve into the intricacies of carcinogenesis. Despite the pharmaceutical industry's substantial investment of both capital and time in the drug screening and development pipeline, a concerning trend persists: drug candidates screened on conventional cancer models exhibit a dismal success rate in clinical trials. One pivotal factor contributing to this discrepancy is the absence of drug testing on pathophysiologically biomimetic 3D cancer models during pre-clinical stages. Unfortunately, current manual methods of 3D cancer modeling, such as spheroids and organoids, suffer from limitations in reproducibility and scalability. In our study, we have meticulously developed 3D bioprinted breast cancer model utilizing decellularized adipose tissue-based hydrogel obtained via a detergent-free decellularization method. Our innovative printing techniques allows for rapid, high-throughput fabrication of 3D cancer models in a 96-well plate format, demonstrating unmatched scalability and reproducibility. Moreover, we have conducted extensive validation, showcasing the efficacy of our platform through drug screening assays involving two potent anti-cancer drugs, 5-Fluorouracil and PRIMA-1Met. Notably, our platform facilitates effortless imaging and gene expression analysis, streamlining the evaluation process. In a bid to enhance the relevance of our cancer model, we have introduced a heterogeneous cell population into the DAT-based bioink. Through meticulous optimization and characterization, we have successfully developed a biomimetic immunocompetent breast cancer model, complete with microenvironmental cues and diverse cell populations. This breakthrough paves the way for rapid multiplex drug screening and the development of personalized cancer models, marking a paradigm shift in cancer research and pharmaceutical development.",
    trivimaUse:
      "Bioink extrudability and bioprinting were optimized on a Next Big Innovation Labs printer with an analog pressure dial. The multicellular model, combining MDA-MB-231 cancer cells, NIH-3T3 fibroblasts and THP-1 cells, was bioprinted on the extrusion-based Trivima Bioplotter, with the cell-laden hydrogel loaded into the cold extruder tool head and printed at 15 °C at 800 mm min⁻¹.",
    machine: "Trivima Bioplotter",
    institutions: ["Indian Institute of Technology Hyderabad"],
    topics: ["Breast cancer models", "Drug screening", "High throughput bioprinting"],
    thumb: "/publications/thumbs/immunocompetent-breast-cancer-model.webp",
    pdf: "/publications/Shukla_2024_Biofabrication_16_035030.pdf",
  },
  {
    slug: "dat-breast-cancer-bioprinting",
    title:
      "High Throughput Bioprinting Using Decellularized Adipose Tissue-Based Hydrogels for 3D Breast Cancer Modeling",
    authors: ["Priyanshu Shukla", "Ashis Kumar Bera", "Sriya Yeleswarapu", "Falguni Pati"],
    journal: "Macromolecular Bioscience",
    year: "2024",
    doi: "10.1002/mabi.202400035",
    url: "https://doi.org/10.1002/mabi.202400035",
    abstract:
      "3D bioprinting allows rapid automated fabrication and can be applied for high throughput generation of biomimetic constructs for in vitro drug screening. Decellularized extracellular matrix (dECM) hydrogel is a popular biomaterial choice for tissue engineering and studying carcinogenesis as a tumor microenvironmental mimetic. This study proposes a method for high throughput bioprinting with decellularized adipose tissue (DAT) based hydrogels for 3D breast cancer modeling. A comparative analysis of decellularization protocol using detergent-based and detergent-free decellularization methods for caprine-origin adipose tissue is performed, and the efficacy of dECM hydrogel for 3D cancer modeling is assessed. Histological, biochemical, morphological, and biological characterization and analysis showcase the cytocompatibility of DAT hydrogel. The rheological property of DAT hydrogel and printing process optimization is assessed to select a bioprinting window to attain 3D breast cancer models. The bioprinted tissues are characterized for cellular viability and tumor cell-matrix interactions. Additionally, an approach for breast cancer modeling is shown by performing rapid high throughput bioprinting in a 96-well plate format, and in vitro drug screening using 5-fluorouracil is performed on 3D bioprinted microtumors. The results of this study suggest that high throughput bioprinting of cancer models can potentially have downstream clinical applications like multi-drug screening platforms and personalized disease models.",
    trivimaUse:
      "A dual-nozzle NBIL bioprinter was used to bioprint MDA-MB-231 cells into a lattice-geometry triple-negative breast cancer model, and bioink extrudability and bioprinting were optimized on the same Next Big Innovation Labs printer. Average cell viability in the bioprinted constructs reached 94% on day 2 and 95% on day 7 across the printing speeds tested.",
    machine: "Dual nozzle NBIL bioprinter",
    institutions: ["Indian Institute of Technology Hyderabad"],
    topics: ["Breast cancer models", "Decellularized ECM", "96-well bioprinting"],
    thumb: "/publications/thumbs/dat-breast-cancer-bioprinting.webp",
    pdf: "/publications/Macromolecular Bioscience - 2024 - Shukla - High Throughput Bioprinting Using Decellularized Adipose Tissue%E2%80%90Based Hydrogels 2.pdf",
  },
  {
    slug: "alginate-hydroxyapatite-bone-ink",
    title:
      "Optimization and Characterization of 3D Bioprintable Alginate and Hydroxyapatite Based Biomaterial Ink",
    authors: ["Kavita Kumari Thakur", "Ramesh Lekurwale", "Sangita Bansode", "Rajesh Pansare"],
    journal: "Journal of The Institution of Engineers (India): Series C",
    year: "2024",
    citation: "105(6), 1531–1543",
    doi: "10.1007/s40032-024-01112-5",
    url: "https://doi.org/10.1007/s40032-024-01112-5",
    abstract:
      "3D bioprinting can be utilised to create complex tissues with fine control over the tissue's creation process. 3D bioprinting technology deposits materials layer by layer to obtain customized geometries for creating functional tissue. The 3D bioprinted scaffold provides cells with an ideal environment to grow and proliferate. Customized constructs can be printed by 3D bioprinting techniques by using different biomaterials and cells. Scaffold properties can be tailored for geometries, porosities as well as mechanical properties. This study reports the synthesis of sodium alginate (Alg)/hydroxyapatite (HA) based bioink which can be printable from an extrusion-based bioprinter and is structurally stable for making bone scaffolds. A hydrogen bond formation between hydroxyl groups and carboxyl groups of alginate with hydroxyl groups of hydroxyapatite assures the stability of HA in the alginate hydrogel system. 1 M calcium chloride (CaCl₂) solution used for the post-printing crosslinking. Prepared bioink were characterized using ESEM (environmental scanning electron microscopy), FTIR (Fourier transform infrared spectroscopy), EDS (Energy dispersive X-ray spectroscopy), DTA (Differential thermal analyzer), and TGA (Thermogravimetric analyzer) tests. Rheological and printability responses were evaluated with a Rheometer. FTIR study confirmed the presence of sodium alginate and HA in the bioink. Different shifts and peaks in C=O and O−H obtained from FTIR indicate the presence of ionic results confirmed the different elements of sodium alginate and HA composites. The calcium/phosphorus (Ca/P) ratio obtained from EDS is in the range of 1.12–1.68. The obtained range for calcium/phosphorus (Ca/P) ratio from EDS analysis ensured the suitability of the bioprinted scaffold for bone regeneration. TGA/DTA results indicated the thermal behaviour and stability of sodium alginate and HA. The viscosity of all the formulated ink of alginate and hydroxyapatite is in the range of viscosity of Extrusion based bioprinter i.e. 30 mPa/s to >6×10⁷ mPa/s. Rheological studies confirmed that the obtained biomaterial-based ink is in the acceptable range suitable for extrusion-based bioprinters. It also confirmed the shear-thinning properties in the prepared ink. The addition of HA increased the shape retention properties of bioprinted constructs. The combination of sodium alginate and HA provided a suitable biomaterial ink for printing bone scaffolds which has the desired properties for bone regeneration.",
    trivimaUse:
      "The alginate and hydroxyapatite ink was printed on an extrusion-based 3D bioprinter, Trivima Basic, from a 3 mL syringe through a 21-gauge needle. The paper concludes that the Trivima Basic bioprinter was used to successfully print the alginate and hydroxyapatite scaffold.",
    machine: "Trivima Basic",
    institutions: [],
    topics: ["Bone scaffolds", "Hydroxyapatite", "Bioink characterisation"],
    thumb: "/publications/thumbs/alginate-hydroxyapatite-bone-ink.webp",
    pdf: "/publications/s40032-024-01112-5 2.pdf",
  },
];

/** Distinct journals, for the section subhead. */
export const PUBLICATION_JOURNALS = Array.from(
  new Set(publications.map((p) => p.journal)),
);

export function getPublication(slug: string) {
  return publications.find((p) => p.slug === slug);
}
