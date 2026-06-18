import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-20 lg:py-28 bg-[var(--color-surface)] border-y border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-4 lg:mb-8">
          <h2
            id="testimonials-heading"
            className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1] text-balance"
          >
            Trusted in labs that print living tissue
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Principal investigators, postdocs and core-facility managers on what changed
            after a Trivima joined the bench.
          </p>
        </div>
      </div>

      {/* Full-bleed stagger carousel */}
      <StaggerTestimonials />
    </section>
  );
}
