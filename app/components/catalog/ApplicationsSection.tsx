"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Drop, Bone, Heartbeat, Wind, Pill, Plant, Dna } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Hover motion for the group icons. The group header row carries `group`. */
const ICON_MOTION =
  "transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none";

type Application = { title: string; body: string; models: string };
type ApplicationGroup = {
  group: string;
  blurb: string;
  icon: Icon;
  /** Per-group hover move, so the icons don't all animate identically. */
  hover: string;
  items: Application[];
};

// Grouped rather than flat: the range covers enough ground now that one long
// list buries the pharma, food and patient-specific work under the tissue work.
const APPLICATION_GROUPS: ApplicationGroup[] = [
  {
    group: "Soft tissue",
    blurb: "Hydrogel and cell-laden constructs where compliance and cell viability matter most.",
    icon: Drop,
    hover: "group-hover:scale-125 group-hover:-translate-y-0.5",
    items: [
      {
        title: "Stromal & connective tissue models",
        body: "Stromal cell-laden hydrogels for fibrosis, wound-bed and tumour-microenvironment studies, bioprinted at cell-safe pressures.",
        models: "Pro · NP",
      },
      {
        title: "Cartilage constructs",
        body: "Articular and auricular cartilage scaffolds in alginate, GelMA and silk composites, with graded stiffness through the depth.",
        models: "Pro",
      },
      {
        title: "Skin & wound-healing grafts",
        body: "Silk fibroin, collagen and gelatin dressings bioprinted as multilayer skin substitutes for chronic-wound and burn research.",
        models: "Pro",
      },
      {
        title: "Organoids & spheroids",
        body: "Reproducible organoid arrays and spheroids with consistent geometry for disease models.",
        models: "Pro · NP",
      },
    ],
  },
  {
    group: "Hard tissue",
    blurb: "Bioceramic and composite bioprinting for load-bearing and craniofacial work.",
    icon: Bone,
    hover: "group-hover:rotate-[18deg] group-hover:scale-110",
    items: [
      {
        title: "Cortical & trabecular bone scaffolds",
        body: "Hydroxyapatite, tricalcium phosphate and PCL composites bioprinted with tuned porosity for cortical and trabecular regions.",
        models: "Pro",
      },
      {
        title: "Craniofacial & jaw reconstruction",
        body: "Patient-specific mandibular and maxillary scaffolds bioprinted from segmented CT data for reconstruction research.",
        models: "Pro",
      },
      {
        title: "Dental & periodontal constructs",
        body: "Tooth-shaped scaffolds, periodontal ligament interfaces and alveolar bone models for regenerative dentistry.",
        models: "Pro",
      },
    ],
  },
  {
    group: "Vascular & cardiovascular",
    blurb: "Rotary and non-planar bioprinting for lumens, conduits and curved surfaces.",
    icon: Heartbeat,
    hover: "group-hover:scale-125",
    items: [
      {
        title: "Carotid & small-diameter arteries",
        body: "Perfusable carotid-scale conduits and small-diameter vessels bioprinted coaxially, with distinct intimal and medial layers.",
        models: "NP · Pro",
      },
      {
        title: "Non-planar heart stents",
        body: "Stents and vascular supports bioprinted directly onto curved rotating mandrels, so the toolpath follows the vessel instead of being sliced flat.",
        models: "NP",
      },
      {
        title: "SWIFT & sacrificial vascular networks",
        body: "Sacrificial writing into functional tissue: channels bioprinted through a dense cellular matrix, then flushed to leave a perfusable network behind.",
        models: "Pro · NP",
      },
      {
        title: "Vascular & tubular constructs",
        body: "Perfusable grafts, small-diameter vessels and ducts via coaxial and rotary bioprinting.",
        models: "NP · Pro",
      },
    ],
  },
  {
    group: "Respiratory & organ-on-chip",
    blurb: "High-resolution bioprinting where the internal geometry is the experiment.",
    icon: Wind,
    hover: "group-hover:translate-x-1 group-hover:scale-110",
    items: [
      {
        title: "Alveolar & lung-parenchyma models",
        body: "Thin-walled alveolar sacs and acinar geometries bioprinted to study gas exchange, surfactant behaviour and inhaled-drug response.",
        models: "Aura",
      },
      {
        title: "Respiratory & airway models",
        body: "Tracheal and bronchial scaffolds with uniform internal lumens.",
        models: "NP",
      },
      {
        title: "Organ-on-chip systems",
        body: "Microfluidic devices and compartmentalized tissue chambers at high resolution.",
        models: "Aura",
      },
      {
        title: "Ocular & corneal constructs",
        body: "Hydrogel contact-lens prototypes and corneal models with mold-assisted workflows.",
        models: "NP",
      },
    ],
  },
  {
    group: "Pharma & nutraceutical printing",
    blurb: "Dose-on-demand printing for personalised medicine and supplement research.",
    icon: Pill,
    hover: "group-hover:-rotate-[25deg] group-hover:scale-110",
    items: [
      {
        title: "Personalised drug tablets",
        body: "Printed oral dosage forms with patient-specific dose, geometry and release profile, including multi-compartment polypills.",
        models: "Pro · NP",
      },
      {
        title: "Nutraceutical dosage forms",
        body: "Printed supplement formats with tailored actives, layered release and per-patient nutrient loading.",
        models: "Pro · NP",
      },
    ],
  },
  {
    group: "Cellular agriculture & materials",
    blurb: "Bioprinting beyond the clinic, where the same extrusion physics applies.",
    icon: Plant,
    hover: "group-hover:rotate-12 group-hover:scale-110",
    items: [
      {
        title: "Cultivated meat",
        body: "Muscle and adipose constructs bioprinted onto edible scaffolds to build whole-cut texture rather than mince.",
        models: "Pro · NP",
      },
      {
        title: "Bio-fabricated leather",
        body: "Collagen and mycelium-based sheets bioprinted to controlled thickness and grain for animal-free leather research.",
        models: "Pro · NP",
      },
      {
        title: "Soft & hard tissue scaffolds",
        body: "Hydrogel, bioceramic and synthetic-polymer scaffolds across the extrusion range.",
        models: "Pro",
      },
    ],
  },
  {
    group: "Patient-specific & stem cell",
    blurb: "Autologous and iPSC-derived work built around a single patient's data.",
    icon: Dna,
    hover: "group-hover:rotate-[20deg] group-hover:scale-110",
    items: [
      {
        title: "Stem-cell-derived constructs",
        body: "iPSC and MSC-derived tissue bioprinted into patient-matched geometries for autologous regenerative research.",
        models: "Pro · NP",
      },
      {
        title: "Genetically modified tissue models",
        body: "Edited cell lines bioprinted into defined architectures to study disease variants in a native-like context.",
        models: "Pro",
      },
    ],
  },
];

export default function ApplicationsSection() {
  const reduce = useReducedMotion();

  return (
    <section id="applications" aria-labelledby="applications-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Sticky intro */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 flex flex-col gap-4">
            <h2
              id="applications-heading"
              className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              What researchers bioprint
            </h2>
            <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
              Across the range, Trivima bioprinters fabricate the constructs behind
              tissue engineering, regenerative medicine, cellular agriculture and
              personalised medicine.
            </p>
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              Not sure which bioprinter fits?{" "}
              <Link href="#contact" className="font-medium text-[var(--color-brand-strong)] hover:underline underline-offset-4">
                Talk to us
              </Link>
              {" "}and our support team will help you choose.
            </p>
          </div>
        </div>

        {/* Application rows, grouped by field */}
        <div className="lg:col-span-8 flex flex-col gap-14">
          {APPLICATION_GROUPS.map(({ group, blurb, icon: Icon, hover, items }) => (
            <div key={group} className="flex flex-col">
              <div className="group flex flex-col gap-1.5 pb-4">
                <h3 className="flex items-center gap-2.5 text-[14px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
                  <Icon
                    size={20}
                    weight="duotone"
                    aria-hidden="true"
                    className={`${ICON_MOTION} ${hover}`}
                  />
                  {group}
                </h3>
                <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[56ch]">
                  {blurb}
                </p>
              </div>

              <dl className="border-t border-[var(--color-hairline)]">
                {items.map((app, i) => (
                  <motion.div
                    key={app.title}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: (i % 2) * 0.05, duration: 0.5, ease: EASE }}
                    className="group grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 border-b border-[var(--color-hairline)] py-6"
                  >
                    <div className="flex flex-col gap-1.5">
                      <dt className="font-display text-[1.125rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                        {app.title}
                      </dt>
                      <dd className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[52ch]">
                        {app.body}
                      </dd>
                    </div>
                    <span className="font-mono text-[12px] text-[var(--color-brand-strong)] sm:text-right sm:pt-1 whitespace-nowrap">
                      {app.models}
                    </span>
                  </motion.div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
