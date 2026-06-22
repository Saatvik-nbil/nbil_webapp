import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CaretRight,
  Cube,
  Lightning,
  Flask,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ContactSection from "@/app/components/ContactSection";
import MachineGallery from "@/app/components/machine/MachineGallery";
import ExplodedScroll from "@/app/components/machine/ExplodedScroll";
import Reveal from "@/app/components/machine/Reveal";
import { Button } from "@/components/ui/button";
import { machines, getMachine, COMPANY } from "@/lib/machines";

export function generateStaticParams() {
  return machines.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMachine(slug);
  if (!m) return { title: "Model not found" };
  return {
    title: `${m.fullName}`,
    description: `${m.tagline} ${m.blurb}`,
    alternates: { canonical: m.sourceUrl },
    openGraph: {
      title: `${m.fullName} | Trivima by NBIL`,
      description: m.blurb,
      images: [{ url: m.heroImage.src, alt: m.heroImage.alt }],
    },
  };
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-[1.625rem] lg:text-[2rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-tight">
    {children}
  </h2>
);

export default async function MachinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const machine = getMachine(slug);
  if (!machine) notFound();

  const others = machines.filter((m) => m.slug !== machine.slug);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: machine.fullName,
    description: machine.overview,
    brand: { "@type": "Brand", name: COMPANY.name, alternateName: COMPANY.short },
    manufacturer: {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.site,
      email: COMPANY.email,
    },
    category: "Scientific Equipment",
    additionalProperty: machine.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
    offers: {
      "@type": "Offer",
      url: machine.sourceUrl,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: COMPANY.name },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        description: "Contact NBIL for pricing. Custom configurations available.",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <NavBar />

      <main id="main-content">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-7xl mx-auto px-6 pt-28 lg:pt-32"
        >
          <ol className="flex items-center gap-2 text-[12px] text-[var(--color-ink-faint)]" role="list">
            <li><Link href="/" className="hover:text-[var(--color-ink)] transition-colors">Home</Link></li>
            <li aria-hidden="true"><CaretRight size={12} weight="bold" /></li>
            <li><Link href="/trivima" className="hover:text-[var(--color-ink)] transition-colors">Bioprinters</Link></li>
            <li aria-hidden="true"><CaretRight size={12} weight="bold" /></li>
            <li className="text-[var(--color-ink-muted)]" aria-current="page">{machine.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section aria-labelledby="machine-heading" className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <MachineGallery
              images={machine.images}
              name={machine.name}
              role={machine.role}
              year={machine.year}
            />

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
                  <span>{machine.tier}</span>
                  <span aria-hidden="true">·</span>
                  <span>{machine.role}</span>
                </div>
                <h1
                  id="machine-heading"
                  className="font-display text-[2.5rem] lg:text-[3.25rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)] leading-[1.05]"
                >
                  {machine.name}
                </h1>
                <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[48ch]">
                  {machine.tagline}
                </p>
              </div>

              {/* Stat band */}
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-5 border-y border-[var(--color-hairline)] py-6">
                {machine.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <dd className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-none">
                      {s.value}
                      {s.unit ? (
                        <span className="ml-0.5 text-[0.85rem] font-mono font-medium text-[var(--color-ink-muted)]">
                          {s.unit}
                        </span>
                      ) : null}
                    </dd>
                    <dt className="text-[11px] text-[var(--color-ink-muted)] leading-snug">{s.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="h-11 px-6 rounded-xl text-[15px]">
                  <Link href="/#contact">
                    Request a quote
                    <ArrowRight data-icon="inline-end" weight="bold" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 px-6 rounded-xl text-[15px]">
                  <a href={machine.sourceUrl} target="_blank" rel="noopener noreferrer">
                    View on nbil.com
                    <ArrowUpRight data-icon="inline-end" weight="bold" />
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-[var(--color-ink-muted)]">
                <span>
                  <span className="text-[var(--color-ink-faint)]">Software</span>{" "}
                  <span className="font-medium text-[var(--color-ink)]">{machine.software}</span>
                </span>
                <span>
                  <span className="text-[var(--color-ink-faint)]">File formats</span>{" "}
                  <span className="font-mono text-[var(--color-ink)]">.stl .obj .gcode .amf</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section aria-labelledby="overview-heading" className="py-12 lg:py-16 bg-[var(--color-surface)] border-y border-[var(--color-hairline)]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <h2 id="overview-heading" className="font-display text-[1.125rem] font-semibold text-[var(--color-ink-muted)]">
                Overview
              </h2>
            </div>
            <Reveal className="lg:col-span-8">
              <p className="font-display text-[1.375rem] lg:text-[1.625rem] font-medium tracking-[-0.02em] text-[var(--color-ink)] leading-[1.4]">
                {machine.overview}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Exploded scroll sequence (NP only) */}
        {machine.slug === "trivima-np" && <ExplodedScroll />}

        {/* Specifications */}
        <section aria-labelledby="specs-heading" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="flex items-center gap-3 mb-10">
              <Cube size={22} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
              <SectionHeading><span id="specs-heading">Technical specifications</span></SectionHeading>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {machine.specs.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={(i % 2) * 0.05}
                  className="group flex flex-col gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)]"
                >
                  <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                    {s.label}
                  </span>
                  <span className="text-[15px] font-medium text-[var(--color-ink)] leading-snug">
                    {s.value}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features + Technologies */}
        <section aria-labelledby="features-heading" className="py-20 lg:py-28 bg-[var(--color-surface)] border-y border-[var(--color-hairline)]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Features */}
            <div className="flex flex-col gap-8">
              <Reveal className="flex items-center gap-3">
                <Lightning size={22} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
                <SectionHeading><span id="features-heading">Key features</span></SectionHeading>
              </Reveal>
              <ul className="flex flex-col gap-3.5" role="list">
                {machine.features.map((f, i) => (
                  <Reveal as="li" key={f} delay={i * 0.04} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-surface)]">
                      <Check size={12} weight="bold" className="text-[var(--color-brand)]" aria-hidden="true" />
                    </span>
                    <span className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed">{f}</span>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Technologies + fixtures */}
            <div className="flex flex-col gap-8">
              <Reveal className="flex items-center gap-3">
                <Flask size={22} weight="duotone" className="text-[var(--color-brand)]" aria-hidden="true" />
                <h2 className="font-display text-[1.625rem] lg:text-[2rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-tight">
                  Printing technologies
                </h2>
              </Reveal>
              <div className="flex flex-wrap gap-2.5">
                {machine.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {machine.fixtures && machine.fixtures.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[13px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                    Compatible bed fixtures
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {machine.fixtures.map((f) => (
                      <span
                        key={f}
                        className="rounded-lg bg-[var(--color-surface-raised)] px-3.5 py-1.5 text-[13px] text-[var(--color-ink-muted)]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {machine.validation && (
                <div className="flex items-start gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] p-5">
                  <Buildings size={20} weight="duotone" className="mt-0.5 shrink-0 text-[var(--color-brand)]" aria-hidden="true" />
                  <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">{machine.validation}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Applications */}
        <section aria-labelledby="apps-heading" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="mb-10">
              <SectionHeading><span id="apps-heading">Applications</span></SectionHeading>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {machine.applications.map((app, i) => (
                <Reveal
                  key={app.title}
                  delay={(i % 3) * 0.05}
                  className="flex flex-col gap-2.5 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6"
                >
                  <span className="h-1 w-8 rounded-full bg-[var(--color-brand)]" aria-hidden="true" />
                  <h3 className="font-display text-[16px] font-semibold tracking-[-0.015em] text-[var(--color-ink)] leading-snug">
                    {app.title}
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">{app.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Explore the rest of the range */}
        <section aria-labelledby="others-heading" className="py-16 lg:py-20 bg-[var(--color-surface-raised)] border-t border-[var(--color-hairline)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <h2 id="others-heading" className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Explore the rest of the range
              </h2>
              <Link href="/trivima#models" className="text-[13px] font-medium text-[var(--color-brand-strong)] hover:underline whitespace-nowrap">
                All models
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-xl">
              {others.map((m) => (
                <Link
                  key={m.slug}
                  href={`/machines/${m.slug}`}
                  className="group flex flex-col gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-brand)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex aspect-square items-center justify-center rounded-lg bg-[var(--color-surface-raised)] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.heroImage.src}
                      alt={m.heroImage.alt}
                      className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-strong)] transition-colors">
                      {m.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-faint)]">{m.tier}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
