import { machines } from "@/lib/machines";
import { FeatureCard } from "./MachineCard";

// Specialised / newest systems get the large feature treatment.
const FEATURED = ["trivima-np", "trivima-aura"];
const FLAGSHIP = "trivima-pro";

export default function ModelsSection() {
  const featured = FEATURED.map((s) => machines.find((m) => m.slug === s)!).filter(Boolean);
  const flagship = machines.find((m) => m.slug === FLAGSHIP);

  return (
    <section id="models" aria-labelledby="models-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl mb-12 lg:mb-16">
          <h2
            id="models-heading"
            className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.12]"
          >
            One family, three bioprinters
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Every Trivima bioprinter shares the same control philosophy and open
            biomaterial approach. They differ in how they bioprint: number of extruders,
            the bioprinting technologies on board, and the geometry they can reach.
          </p>
        </div>

        {/* Featured / specialised systems */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-hairline)] pb-3">
            <h3 className="font-display text-[1.0625rem] font-semibold text-[var(--color-ink)]">
              Specialised bioprinters
            </h3>
            <span className="text-[13px] text-[var(--color-ink-muted)]">Non-planar &amp; light-based bioprinting</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((m, i) => (
              <FeatureCard key={m.slug} machine={m} index={i} />
            ))}
          </div>
        </div>

        {/* Flagship extrusion system */}
        {flagship && (
          <div className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-hairline)] pb-3">
              <h3 className="font-display text-[1.0625rem] font-semibold text-[var(--color-ink)]">
                The flagship bioprinter
              </h3>
              <span className="text-[13px] text-[var(--color-ink-muted)]">Multi-technology extrusion bioprinting</span>
            </div>
            <FeatureCard machine={flagship} index={0} />
          </div>
        )}
      </div>
    </section>
  );
}
