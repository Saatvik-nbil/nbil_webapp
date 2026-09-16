"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Drop, Bone, Heartbeat, Pill, Dna, CaretDown } from "@phosphor-icons/react";
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

// Grouped rather than flat, and five fields rather than seven: the range
// covers enough ground now that one long list buries the pharma, food and
// patient-specific work under the tissue work.
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
    group: "Vascular, respiratory & organ-on-chip",
    blurb: "Rotary, non-planar and high-resolution bioprinting, where the internal geometry is the experiment.",
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
    group: "Pharma, nutraceutical & cellular agriculture",
    blurb: "Dose-on-demand printing, and bioprinting beyond the clinic where the same extrusion physics applies.",
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
  const panelBase = useId();
  /* One field open at a time. Laying all five out at once made this the
     longest single run on the site; collapsed, the section is a five-line
     list until the reader asks for a field, and opening one closes the last. */
  const [openGroup, setOpenGroup] = useState(APPLICATION_GROUPS[0].group);

  return (
    <section id="applications" aria-labelledby="applications-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 lg:mb-14 flex max-w-[62ch] flex-col gap-4">
          <h2
            id="applications-heading"
            className="h2"
          >
            What researchers bioprint
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Across the range, Trivima bioprinters fabricate the constructs behind
            tissue engineering, regenerative medicine, cellular agriculture and
            personalised medicine. Pick a field to see what it covers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* The five fields, collapsed. */}
          <div className="lg:col-span-8">
            <div className="border-t border-[var(--color-hairline)]">
              {APPLICATION_GROUPS.map(({ group, blurb, icon: Icon, hover, items }) => {
                const open = openGroup === group;
                const panelId = panelBase + "-" + group.replace(/\W+/g, "-");

                return (
                  <div key={group} className="border-b border-[var(--color-hairline)]">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenGroup(open ? "" : group)}
                        aria-expanded={open}
                        aria-controls={panelId}
                        className="group flex w-full items-center gap-3 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60 focus-visible:ring-offset-2"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                          <Icon
                            size={20}
                            weight="duotone"
                            aria-hidden="true"
                            className={"text-[var(--color-brand-strong)] " + ICON_MOTION + " " + hover}
                          />
                        </span>
                        <span className="flex-1 font-display text-[1.25rem] lg:text-[1.375rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                          {group}
                        </span>
                        {/* The chevron is the only affordance saying these
                            rows open, so it is a real target rather than a
                            hairline glyph: a filled disc that inverts to the
                            brand colour while its field is open. */}
                        <span
                          aria-hidden="true"
                          className={
                            "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 motion-reduce:transition-none " +
                            (open
                              ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                              : "border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] group-hover:border-[var(--color-brand)] group-hover:text-[var(--color-brand-strong)]")
                          }
                        >
                          <CaretDown
                            size={18}
                            weight="bold"
                            className={
                              "transition-transform duration-300 motion-reduce:transition-none " +
                              (open ? "rotate-180" : "")
                            }
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          key="panel"
                          id={panelId}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[56ch]">
                            {blurb}
                          </p>
                          <dl className="border-t border-[var(--color-hairline)]">
                            {items.map((app) => (
                              <div
                                key={app.title}
                                className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 border-b border-[var(--color-hairline)] py-5 last:border-b-0"
                              >
                                <div className="flex flex-col gap-1.5">
                                  <dt className="font-display text-[1.0625rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                                    {app.title}
                                  </dt>
                                  <dd className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-[52ch]">
                                    {app.body}
                                  </dd>
                                </div>
                                <span className="text-[12px] text-[var(--color-brand-strong)] sm:text-right sm:pt-1 whitespace-nowrap">
                                  {app.models}
                                </span>
                              </div>
                            ))}
                          </dl>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stays in view while the reader works down the list. */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6">
              <p className="font-display text-[1.125rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                Not sure which bioprinter fits?
              </p>
              <p className="mt-2 text-[14px] text-[var(--color-ink-muted)] leading-relaxed">
                Tell us what you are trying to build and our support team will
                point you at the right machine in the range.
              </p>
              <Link
                href="#contact"
                className="mt-4 inline-flex text-[14px] font-medium text-[var(--color-brand-strong)] hover:underline underline-offset-4"
              >
                Talk to us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
