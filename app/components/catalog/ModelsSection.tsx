import { machines } from "@/lib/machines";
import ModelsRow from "./ModelsRow";

// Order the row reads left to right: the two specialised systems first, the
// flagship last, matching how the range is introduced everywhere else.
const ORDER = ["trivima-np", "trivima-aura", "trivima-pro"];

export default function ModelsSection() {
  const ordered = ORDER.map((slug) => machines.find((m) => m.slug === slug)).filter(
    (m): m is (typeof machines)[number] => Boolean(m),
  );

  return (
    <section id="models" aria-labelledby="models-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 max-w-2xl lg:mb-14">
          <h2
            id="models-heading"
            className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.12]"
          >
            One family, three bioprinters, each built to your spec
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Every Trivima bioprinter shares the same control philosophy and open
            biomaterial approach. They differ in how they bioprint: number of extruders,
            the bioprinting technologies on board, and the geometry they can reach. None
            of them ships as a fixed box. Extruder count, print heads, build volume,
            fixtures and crosslinking wavelengths are all specified with you before we
            build.
          </p>
        </div>

        <p className="mb-4 hidden text-[12.5px] text-[var(--color-ink-faint)] lg:block">
          Hover a model to open its specification.
        </p>

        <ModelsRow machines={ordered} />
      </div>
    </section>
  );
}
