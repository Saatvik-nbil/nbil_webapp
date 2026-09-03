import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import BlogMedia, { type MediaKind } from "@/app/components/blog/BlogMedia";
import { COMPANY } from "@/lib/machines";
import { OriginButton } from "@/components/ui/origin-button";

const TITLE = "Getting Started with Dhee: A Quick-Start Guide";
const DESCRIPTION =
  "Import your model, configure the basic settings, review the toolpath and export a sliced file. A nine-step walkthrough of your first print with Dhee, the control suite for Trivima NP and Pro bioprinters.";
const PUBLISHED = "2026-07-31";
const PUBLISHED_LABEL = "July 31, 2026";
const URL = "https://nextbiginnovationlabs.com/blogs/dhee-quick-start";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: PUBLISHED,
    images: [
      {
        url: "/images/blog/dhee-quick-start-cover.svg",
        width: 1200,
        height: 630,
        alt: "Dhee Slicer quick-start guide cover",
      },
    ],
  },
};

type Step = {
  title: string;
  body: string[];
  list?: string[];
  callout?: { type: "check" | "important"; text: string };
  media: { kind: MediaKind; caption: string };
};

const STEPS: Step[] = [
  {
    title: "Import your model",
    body: [
      "Click **Import Model** and select your 3D file. Dhee reads .stl and .gcode directly, so there is no conversion step before you start.",
    ],
    callout: { type: "check", text: "The model appears on the build platform." },
    media: {
      kind: "screenshot",
      caption: "The Import Model button with a freshly loaded model on the platform.",
    },
  },
  {
    title: "Position the model",
    body: [
      "Select the model and click **Place on Platform**, then use **Center Model** to move it to the middle of the build area.",
    ],
    callout: {
      type: "check",
      text: "The complete model stays inside the platform boundary.",
    },
    media: {
      kind: "gif",
      caption:
        "A short loop showing the model being dragged and then snapped to the centre of the build area.",
    },
  },
  {
    title: "Check the orientation",
    body: [
      "Rotate the model so it rests on a stable base. For simple geometries, put the largest flat surface against the platform.",
      "On the NP, remember that the rotary spindle prints along a revolving mandrel rather than a flat bed, so orient tubular parts along the spindle axis.",
    ],
    callout: {
      type: "check",
      text: "The model neither floats above the platform nor extends below it.",
    },
    media: {
      kind: "screenshot",
      caption:
        "A before-and-after pair showing a poorly oriented model next to a corrected one.",
    },
  },
  {
    title: "Select a profile",
    body: [
      "Open the **Profile** menu and choose the recommended NBIL configuration for your machine and nozzle.",
      "The profile governs layer height, nozzle settings, wall thickness, infill and print movement as a validated set.",
    ],
    callout: {
      type: "important",
      text: "Do not alter validated settings unless a protocol or a member of the NBIL team instructs you to.",
    },
    media: {
      kind: "screenshot",
      caption: "The Profile menu with the recommended configuration highlighted.",
    },
  },
  {
    title: "Review the basic settings",
    body: [
      "Before slicing, confirm each of these reads the value you expect:",
    ],
    list: [
      "Layer height",
      "Model scale",
      "Infill",
      "Wall thickness",
      "Selected nozzle",
      "Per-extruder temperature and pressure",
    ],
    callout: { type: "check", text: "Every required field contains a valid value." },
    media: {
      kind: "screenshot",
      caption:
        "The basic settings panel, with the fields worth reviewing numbered or outlined.",
    },
  },
  {
    title: "Slice the model",
    body: [
      "Click **Slice** or **Generate Toolpath** and wait until Dhee confirms that slicing has finished. Multi-extruder and non-planar jobs take longer than a single-head flat print.",
    ],
    callout: { type: "check", text: "The process completes and the layer preview opens." },
    media: {
      kind: "video",
      caption:
        "A clip running from the click through to the completion state. Capture the finished result, not just the loading bar.",
    },
  },
  {
    title: "Review the preview",
    body: [
      "Use the layer slider to inspect the first, middle and final layers. You are looking for continuous paths and any missing sections.",
    ],
    callout: {
      type: "important",
      text: "Always inspect the first layer before exporting. That is where adhesion problems show up first.",
    },
    media: {
      kind: "gif",
      caption:
        "A loop scrubbing the layer slider from the first layer to the last.",
    },
  },
  {
    title: "Check for warnings",
    body: ["Review the status panel and resolve anything critical. The usual culprits:"],
    list: [
      "Model outside the build area",
      "Unsupported geometry",
      "Missing or mismatched profile",
      "No layers generated",
    ],
    callout: { type: "check", text: "No unresolved critical warning remains." },
    media: {
      kind: "screenshot",
      caption:
        "The warning or status panel. Use an example free of confidential project data.",
    },
  },
  {
    title: "Export the file",
    body: [
      "Click **Export**, choose the required format and save the output. A predictable name such as `model-name_profile_version` saves a lot of guesswork later.",
    ],
    callout: { type: "check", text: "The exported file is present and non-empty." },
    media: {
      kind: "screenshot",
      caption: "The export window. Hide confidential file paths before publishing.",
    },
  },
];

const REQUIREMENTS = [
  "A supported 3D model file",
  "The recommended NBIL profile for your machine",
  "A folder for the exported file",
];

const FINAL_CHECK = [
  "Correct model imported",
  "Model positioned correctly",
  "Correct profile selected",
  "Slicing completed",
  "Layers reviewed",
  "No critical warnings",
  "File exported",
  "Output verified",
];

const TROUBLESHOOTING = [
  "The model does not import",
  "No layers are generated",
  "The toolpath contains missing sections",
  "A critical error cannot be resolved",
];

/** Renders **bold** and `code` spans inside step copy. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-[var(--color-ink)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded-md bg-[var(--color-surface-raised)] px-1.5 py-0.5 text-[0.9em] text-[var(--color-ink)]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

function Callout({ type, text }: { type: "check" | "important"; text: string }) {
  const isCheck = type === "check";
  return (
    <div
      className={`mt-5 rounded-xl border-l-[3px] px-4 py-3 text-[14px] leading-relaxed ${
        isCheck
          ? "border-[var(--color-brand)] bg-[var(--color-brand-surface)] text-[var(--color-ink)]"
          : "border-[#c7992d] bg-[#fff8e8] text-[#5f4a17]"
      }`}
    >
      <span className="mr-1.5 text-[11px] uppercase tracking-[0.14em]">
        {isCheck ? "Check" : "Important"}
      </span>
      {text}
    </div>
  );
}

export default function DheeQuickStartPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: PUBLISHED,
    author: { "@type": "Organization", name: COMPANY.name, url: COMPANY.site },
    publisher: {
      "@type": "Organization",
      name: COMPANY.name,
      url: COMPANY.site,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <main className="bg-[var(--color-canvas)]">
        {/* Hero */}
        <header className="pt-32 pb-12 lg:pt-40 lg:pb-16">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              href="/blogs"
              className="eyebrow text-[var(--color-brand-strong)] transition-colors hover:text-[var(--color-ink)]"
            >
              &larr; Next Big Blogs
            </Link>
            <h1 className="mt-6 font-display text-[clamp(2.1rem,5.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)]">
              {TITLE}
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-[var(--color-ink-muted)]">
              Import your model, configure the basic settings, review the toolpath
              and export the sliced file. Nine steps, one check after each.
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--color-hairline)] pt-6 text-[13px] text-[var(--color-ink-faint)]">
              <span>{PUBLISHED_LABEL}</span>
              <span aria-hidden="true">&middot;</span>
              <span>6 min read</span>
              <span aria-hidden="true">&middot;</span>
              <span>Dhee for Trivima NP &amp; Pro</span>
            </p>
          </div>
        </header>

        {/* Before you start */}
        <section
          aria-labelledby="before-heading"
          className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-14 lg:py-16"
        >
          <div className="mx-auto max-w-3xl px-6">
            <h2
              id="before-heading"
              className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]"
            >
              Before you start
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3" role="list">
              {REQUIREMENTS.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 text-[14px] font-medium leading-relaxed text-[var(--color-ink)]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl border-l-[3px] border-[var(--color-brand)] bg-[var(--color-brand-surface)] px-4 py-3 text-[14px] leading-relaxed text-[var(--color-ink)]">
              <span className="mr-1.5 text-[11px] uppercase tracking-[0.14em]">
                Recommended
              </span>
              Use the default NBIL profile for your first slice, then adjust once
              you have a known-good result to compare against.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section aria-label="Steps" className="bg-[var(--color-canvas)]">
          <div className="mx-auto max-w-6xl px-6">
            {STEPS.map((step, i) => (
              <article
                key={step.title}
                className="grid items-center gap-8 border-t border-[var(--color-hairline)] py-14 lg:grid-cols-2 lg:gap-14 lg:py-16"
              >
                {/* Copy: alternates side with the media on wide screens */}
                <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand)] text-[14px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <h2 className="mt-4 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--color-ink)]">
                    {step.title}
                  </h2>
                  {step.body.map((para, j) => (
                    <p
                      key={j}
                      className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-muted)]"
                    >
                      <RichText text={para} />
                    </p>
                  ))}
                  {step.list && (
                    <ul
                      className="mt-4 flex flex-col gap-2 text-[15px] leading-relaxed text-[var(--color-ink-muted)]"
                      role="list"
                    >
                      {step.list.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-brand)]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {step.callout && (
                    <Callout type={step.callout.type} text={step.callout.text} />
                  )}
                </div>

                {/* Media slot */}
                <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                  <BlogMedia kind={step.media.kind} caption={step.media.caption} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Final check */}
        <section
          aria-labelledby="final-heading"
          className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-14 lg:py-16"
        >
          <div className="mx-auto max-w-3xl px-6">
            <h2
              id="final-heading"
              className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]"
            >
              Final check
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="list">
              {FINAL_CHECK.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-4 py-3 text-[14px] text-[var(--color-ink)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-[4px] border border-[var(--color-hairline)] bg-[var(--color-surface)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Need help */}
        <section
          aria-labelledby="help-heading"
          className="border-t border-[var(--color-hairline)] py-14 lg:py-16"
        >
          <div className="mx-auto max-w-3xl px-6">
            <h2
              id="help-heading"
              className="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]"
            >
              Need help?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              Contact your NBIL support representative if any of the following
              cannot be resolved:
            </p>
            <ul
              className="mt-4 flex flex-col gap-2 text-[15px] leading-relaxed text-[var(--color-ink-muted)]"
              role="list"
            >
              {TROUBLESHOOTING.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-brand)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <OriginButton
                href={`mailto:${COMPANY.email}`}
                className="px-6 font-semibold"
              >
                Contact support
              </OriginButton>
              <OriginButton
                href="/guides"
                variant="outline"
                className="px-6 font-semibold"
              >
                More guides
              </OriginButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
