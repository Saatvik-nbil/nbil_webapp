import { machines } from "@/lib/machines";
import { FeatureCard } from "./MachineCard";

// Both active systems get the large feature treatment.
const FEATURED = ["trivima-np", "trivima-aura"];

export default function ModelsSection() {
  const featured = FEATURED.map((s) => machines.find((m) => m.slug === s)!).filter(Boolean);

  return (
    <section id="models" aria-labelledby="models-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 max-w-2xl mb-12 lg:mb-16">
          <h2
            id="models-heading"
            className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.12]"
          >
            Two specialised systems
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Every Trivima machine shares the same control philosophy and open material
            approach. They differ in how they build: the geometry they can reach and the
            technology on board.
          </p>
        </div>

        {/* Specialised systems */}
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-hairline)] pb-3">
            <h3 className="font-display text-[1.0625rem] font-semibold text-[var(--color-ink)]">
              Specialised systems
            </h3>
            <span className="text-[13px] text-[var(--color-ink-muted)]">Non-planar &amp; light-based</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((m, i) => (
              <FeatureCard key={m.slug} machine={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
