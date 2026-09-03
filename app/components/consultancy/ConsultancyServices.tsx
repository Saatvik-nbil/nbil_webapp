"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Printer,
  FlaskConical,
  Lightbulb,
  Boxes,
  BadgeCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/components/ui/origin-button";

const EASE = [0.16, 1, 0.3, 1] as const;

type Service = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const SERVICES: Service[] = [
  {
    id: "bioprinting-consulting",
    name: "Bioprinting Consulting",
    icon: Printer,
    description:
      "Bring your custom-made biomaterial and we'll print the scaffold you need.",
    features: [
      "Custom scaffold geometries",
      "Print-parameter optimisation",
      "Material-to-print feasibility",
    ],
    cta: "Contact us",
  },
  {
    id: "biomaterial-preparation",
    name: "Biomaterial Preparation",
    icon: FlaskConical,
    description:
      "Custom bioink formulation for bioprinters or for experimentation.",
    features: [
      "Bioink customisation",
      "Pluronic & GelMA formulations",
      "Crosslinking & rheology tuning",
    ],
    cta: "Contact us",
  },
  {
    id: "advisory-consultancy",
    name: "Advisory Consultancy",
    icon: Lightbulb,
    description:
      "Expert advice on bioprinters, materials, protocols and workflows.",
    features: [
      "Hardware & printhead selection",
      "Protocol troubleshooting",
      "Experimental design review",
    ],
    cta: "Contact us",
  },
  {
    id: "lab-ecosystem",
    name: "Complete Lab Ecosystem",
    icon: Boxes,
    description:
      "We build your full bioprinting lab: biofabrication and setup, end to end.",
    features: [
      "Trivima bioprinter + DHEE software",
      "Consumables & in-house bioinks",
      "Training, consulting & microcourses",
    ],
    cta: "Contact us",
    highlighted: true,
  },
];

const HighlightedBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
  />
);

export default function ConsultancyServices() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-24 bg-[var(--color-canvas)] border-t border-[var(--color-hairline)] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-14 lg:mb-16">
          <h2
            id="services-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Consultancy services
          </h2>
          <p className="text-[15.5px] text-[var(--color-ink-muted)] leading-relaxed">
            From a single custom scaffold to a fully equipped bioprinting lab.
            pick the support that fits your work.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            const highlighted = service.highlighted;
            return (
              <motion.div
                key={service.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: (i % 4) * 0.06, duration: 0.5, ease: EASE }}
                className={cn(
                  "relative flex flex-col gap-6 overflow-hidden rounded-2xl border p-6",
                  highlighted
                    ? "border-transparent bg-[var(--color-ink)] text-white shadow-[0_18px_50px_rgba(2,12,27,0.28)]"
                    : "border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[0_10px_30px_rgba(2,12,27,0.06)]",
                )}
              >
                {highlighted && <HighlightedBackground />}

                <div className="relative z-10 flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",
                      highlighted ? "bg-white/10" : "bg-[var(--color-brand-surface)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5",
                        highlighted ? "text-[var(--color-dark-brand)]" : "text-[var(--color-brand-strong)]",
                      )}
                    />
                  </span>
                  <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] leading-tight">
                    {service.name}
                  </h3>
                </div>

                <p
                  className={cn(
                    "relative z-10 text-[14px] leading-relaxed",
                    highlighted ? "text-white/70" : "text-[var(--color-ink-muted)]",
                  )}
                >
                  {service.description}
                </p>

                <ul className="relative z-10 flex-1 space-y-2.5">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className={cn(
                        "flex items-start gap-2 text-[13.5px] font-medium",
                        highlighted ? "text-white/85" : "text-[var(--color-ink-muted)]",
                      )}
                    >
                      <BadgeCheck
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          highlighted ? "text-[var(--color-dark-brand)]" : "text-[var(--color-brand)]",
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Contact button placeholder, pricing intentionally omitted for now */}
                <OriginButton
                  href="#project-form"
                  variant={highlighted ? "outline" : "solid"}
                  className="relative z-10 h-11 w-full text-[14px]"
                >
                  {service.cta}
                  <ArrowRight className="size-4" />
                </OriginButton>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
