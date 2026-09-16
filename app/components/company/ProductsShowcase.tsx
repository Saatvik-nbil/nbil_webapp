import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { OriginButton } from "@/components/ui/origin-button";
import ModelsRow from "@/app/components/catalog/ModelsRow";
import { machines } from "@/lib/machines";

const ORDER = ["trivima-np", "trivima-pro", "trivima-aura"];

/**
 * The range on the landing page. It runs the same expand-on-hover row the
 * catalog uses (`ModelsRow`) rather than a second set of cards: one card
 * behaviour for the bioprinters everywhere they appear, so there is a single
 * place to change it.
 */
export default function ProductsShowcase() {
  const items = ORDER.map((s) => machines.find((m) => m.slug === s)).filter(
    (m): m is (typeof machines)[number] => Boolean(m),
  );

  return (
    <section id="products" aria-labelledby="products-heading" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2
              id="products-heading"
              className="h2"
            >
              Trivima: one bioprinter family, three ways to build
            </h2>
            <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
              A non-planar rotary bioprinter, a six-extruder flagship and a light-based
              bioprinter. Every Trivima shares one bioprinting workflow.
            </p>
          </div>
          <OriginButton
            href="/trivima"
            variant="outline"
            className="h-11 px-5 text-[14px] shrink-0 self-start lg:self-auto"
          >
            Compare the full range
            <ArrowRight size={15} weight="bold" />
          </OriginButton>
        </div>

        <ModelsRow machines={items} />
      </div>
    </section>
  );
}
