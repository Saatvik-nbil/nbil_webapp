import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CaretRight,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import ContactSection from "@/app/components/ContactSection";
import MachineGallery from "@/app/components/machine/MachineGallery";
import AnatomyScroll from "@/app/components/machine/AnatomyScroll";
import Reveal from "@/app/components/machine/Reveal";
import {
  RiseIn,
  MaskedTitle,
  Parallax,
  HeroExit,
  ScrubText,
  Stagger,
  StaggerItem,
  ScrollLine,
} from "@/app/components/motion/ScrollFx";
import MobileCollapse from "@/components/ui/mobile-collapse";
import { OriginButton } from "@/components/ui/origin-button";
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
    // `sourceUrl` is the old WordPress page, which now 301s here; canonical
    // has to be this page's own address.
    alternates: { canonical: `${COMPANY.site}/machines/${m.slug}` },
    openGraph: {
      url: `${COMPANY.site}/machines/${m.slug}`,
      title: `${m.fullName} | Trivima by NBIL`,
      description: m.blurb,
      images: [{ url: m.heroImage.src, alt: m.heroImage.alt }],
    },
  };
}

/** Shared hover motion for the inline icons that still sit inside list rows
    and callouts. Sits on the icon; the row around it carries `group`. */
const ICON_MOTION =
  "transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="h2">
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

  // Formats live in `specs` only. Read them from there so the hero can't drift.
  const fileFormats =
    machine.specs.find((s) => s.label === "Compatible file formats")?.value.replaceAll(",", "") ?? "";

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
      url: `${COMPANY.site}/machines/${machine.slug}`,
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
          {/* Top-aligned, not centred: the gallery column is card + thumbnail
              strip, so centring the copy against the whole column drops it
              below the card's midpoint and leaves it level with nothing. Start
              alignment puts the heading near the card's top edge. */}
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Scroll depth: the gallery drifts down against the page as the
                hero leaves, and the copy beside it lifts. Kept within the
                section's bottom padding so the card never crosses the seam. */}
            <Parallax y={[0, 56]} offset={["start start", "end start"]}>
              <MachineGallery
                images={machine.images}
                name={machine.name}
                role={machine.role}
                year={machine.year}
                maxWidth={machine.slug === "trivima-aura" ? 380 : undefined}
              />
            </Parallax>

            {/* pt-6 ≈ the card's top-5 badge inset plus its py-1, so the heading
                starts level with the role pill and the year chip inside the card. */}
            <HeroExit className="flex flex-col gap-6 lg:pt-6" distance={48} fadeTo={1}>
              <div className="flex flex-col gap-3">
                <MaskedTitle id="machine-heading" className="h1" text={machine.name} />
                <RiseIn as="p" delay={0.25} className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed max-w-[48ch]">
                  {machine.tagline}
                </RiseIn>
              </div>

              {/* The overview used to be its own section under the hero, which
                  left this column ending well above the gallery card beside it.
                  Here it fills that space and the page loses a repeat. */}
              <RiseIn as="p" delay={0.35} className="max-w-[60ch] text-[15px] leading-[1.7] text-[var(--color-ink-muted)]">
                {machine.overview}
              </RiseIn>

              {/* Stat band. Above sm this is a flex row whose cells size to their
                  own content and share the leftover space evenly, so a long value
                  like 150×100×100 can never overrun its neighbour: the divider
                  rule plus a fixed pl-4 keeps every gutter identical. */}
              <RiseIn delay={0.45}>
              <dl className="grid grid-cols-2 gap-y-5 border-y border-[var(--color-hairline)] py-6 sm:flex sm:justify-between sm:gap-y-0">
                {machine.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={[
                      "flex min-w-0 flex-col gap-1 border-[var(--color-hairline)]",
                      // No rule where a row starts: always at 0, and at 2 while
                      // the grid is still two columns wide.
                      i === 0 && "pl-0 border-l-0",
                      i === 2 && "pl-0 border-l-0 sm:pl-4 sm:border-l",
                      i !== 0 && i !== 2 && "pl-4 border-l",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <dd className="font-display text-[1.25rem] lg:text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-none whitespace-nowrap">
                      {s.value}
                      {s.unit ? (
                        <span className="ml-1 text-[0.8rem] font-medium text-[var(--color-ink-muted)]">
                          {s.unit}
                        </span>
                      ) : null}
                    </dd>
                    <dt className="text-[11px] text-[var(--color-ink-muted)] leading-snug">{s.label}</dt>
                  </div>
                ))}
              </dl>
              </RiseIn>

              <RiseIn delay={0.55} className="flex flex-wrap items-center gap-3">
                <OriginButton href="#contact" className="h-11 px-6 text-[15px]">
                  Request a quote
                  <ArrowRight size={16} weight="bold" />
                </OriginButton>
              </RiseIn>

              <RiseIn delay={0.62} className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-[var(--color-ink-muted)]">
                <span>
                  <span className="text-[var(--color-ink-faint)]">Software</span>{" "}
                  {machine.softwareHref ? (
                    <Link
                      href={machine.softwareHref}
                      className="font-medium text-[var(--color-brand-strong)] hover:underline underline-offset-4"
                    >
                      {machine.software}
                    </Link>
                  ) : (
                    <span className="font-medium text-[var(--color-ink)]">{machine.software}</span>
                  )}
                </span>
                <span>
                  <span className="text-[var(--color-ink-faint)]">File formats</span>{" "}
                  <span className="text-[var(--color-ink)]">{fileFormats}</span>
                </span>
              </RiseIn>
            </HeroExit>
          </div>
        </section>

        {/* Guided part-by-part camera tour (NP only) */}
        {machine.slug === "trivima-np" && <AnatomyScroll />}

        {/* Technologies + fixtures. There used to be a "Key features" column
            beside this; it repeated the spec table below it and was removed
            by request. `features` is still in lib/machines.ts, unrendered. */}
        <section aria-labelledby="technologies-heading" className="py-20 lg:py-28 bg-[var(--color-surface)] border-y border-[var(--color-hairline)]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 gap-12 lg:gap-16">
            <div className="flex flex-col gap-8">
              <Reveal className="w-fit">
                <h2 id="technologies-heading" className="h2">
                  Printing technologies
                </h2>
              </Reveal>
              <Stagger className="flex flex-wrap gap-2.5">
                {machine.technologies.map((t) => (
                  <StaggerItem
                    as="span"
                    key={t}
                    className="rounded-lg border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)] motion-reduce:transform-none"
                  >
                    {t}
                  </StaggerItem>
                ))}
              </Stagger>

              {machine.fixtures && machine.fixtures.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[13px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                    Compatible bed fixtures
                  </h3>
                  <Stagger className="flex flex-wrap gap-2.5">
                    {machine.fixtures.map((f) => (
                      <StaggerItem
                        as="span"
                        key={f}
                        className="rounded-lg bg-[var(--color-surface-raised)] px-3.5 py-1.5 text-[13px] text-[var(--color-ink-muted)]"
                      >
                        {f}
                      </StaggerItem>
                    ))}
                  </Stagger>
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

        {/* Specifications. Kept immediately above the build-to-spec block
            so a reader who has just seen the numbers learns which of them
            move. */}
        <section aria-labelledby="specs-heading" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="w-fit">
              <SectionHeading><span id="specs-heading">Technical specifications</span></SectionHeading>
            </Reveal>
            <ScrollLine className="mt-5 mb-10 max-w-[220px]" />
            {/* Twenty-odd specs are a single tall column on a phone, so the
                list opens partly closed there. */}
            <MobileCollapse
              collapsedHeight={620}
              moreLabel="Show all specifications"
              lessLabel="Show fewer specifications"
              fadeTo="var(--color-surface)"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {machine.specs.map((s, i) => (
                  <Reveal
                    key={s.label}
                    delay={(i % 2) * 0.05}
                    className="group flex flex-col gap-1.5 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-subtle)]"
                  >
                    <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                      {s.label}
                    </span>
                    <span className="text-[15px] font-medium text-[var(--color-ink)] leading-snug">
                      {s.value}
                    </span>
                  </Reveal>
                ))}
              </div>
            </MobileCollapse>
          </div>
        </section>

        {/* What can be configured. Sits directly after the fixed specs, so a
            reader who has just seen the numbers learns which of them move. */}
        {machine.customisation && (
          <section
            aria-labelledby="customisation-heading"
            className="py-20 lg:py-28 bg-[var(--color-brand-subtle)] border-b border-[var(--color-hairline)]"
          >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <Reveal className="w-fit">
                  <SectionHeading>
                    <span id="customisation-heading">Built to your spec</span>
                  </SectionHeading>
                </Reveal>
                {/* Reads in word by word as it scrolls, like the home page's
                    mission statement. */}
                <ScrubText
                  text={machine.customisation.summary}
                  className="font-display text-[1.25rem] lg:text-[1.4rem] font-medium tracking-[-0.01em] text-[var(--color-ink)] leading-snug max-w-[40ch]"
                />
                <Reveal>
                  <OriginButton href="#contact" className="mt-2 h-11 w-fit px-6 text-[15px]">
                    Discuss a configuration
                    <ArrowRight size={16} weight="bold" />
                  </OriginButton>
                </Reveal>
              </div>

              <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
                {machine.customisation.options.map((option, i, all) => (
                  <Reveal
                    as="li"
                    key={option}
                    delay={(i % 2) * 0.05}
                    className={[
                      "flex items-start gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4",
                      // An odd count leaves the last card alone beside a hole
                      // the width of the grid; let it run the full width.
                      all.length % 2 === 1 && i === all.length - 1
                        ? "sm:col-span-2"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-[var(--color-brand)]"
                    />
                    <span className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed">{option}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

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
            {/* Two wide cards that fill the row: photo on the left, the
                model's pitch and headline numbers on the right. */}
            <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {others.map((m) => (
                <StaggerItem key={m.slug}>
                <Link
                  href={`/machines/${m.slug}`}
                  className="group grid h-full grid-cols-1 gap-5 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-brand)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-center lg:p-6"
                >
                  {/* The image is absolutely positioned so its 100% height
                      resolves against the square well. Left in flow, a portrait
                      asset (Aura) would size itself from the width and stretch
                      the card past the aspect ratio. */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-surface-raised)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Parallax className="absolute inset-0" y={[30, -30]} scale={[1.08, 0.98]}>
                      <img
                        src={m.heroImage.src}
                        alt={m.heroImage.alt}
                        className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Parallax>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="w-fit rounded-lg bg-[var(--color-brand-subtle)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--color-brand-strong)]">
                        {m.role}
                      </span>
                      <span className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-brand-strong)]">
                        {m.name}
                      </span>
                      <span className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                        {m.tagline}
                      </span>
                    </div>
                    <dl className="flex flex-col gap-2">
                      {m.stats.slice(0, 2).map((s) => (
                        <div
                          key={s.label}
                          className="flex items-baseline justify-between gap-3 border-b border-[var(--color-hairline)] pb-2 last:border-b-0 last:pb-0"
                        >
                          <dt className="text-[12.5px] text-[var(--color-ink-faint)]">{s.label}</dt>
                          <dd className="text-right text-[13.5px] font-medium text-[var(--color-ink)]">
                            {s.value}
                            {s.unit ? ` ${s.unit}` : ""}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--color-brand-strong)]">
                      View {m.name}
                      <ArrowRight
                        size={14}
                        weight="bold"
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </span>
                  </div>
                </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <ContactSection defaultModel={machine.name} />
      </main>

      <Footer />
    </>
  );
}
