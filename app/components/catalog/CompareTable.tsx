import Link from "next/link";
import { machines, type Machine } from "@/lib/machines";

// Pull a spec value by fuzzy label match, with a fallback.
function spec(m: Machine, keyword: string, fallback = "N/A"): string {
  const hit = m.specs.find((s) => s.label.toLowerCase().includes(keyword.toLowerCase()));
  return hit ? hit.value : fallback;
}

type Row = { label: string; get: (m: Machine) => React.ReactNode };

const ROWS: Row[] = [
  { label: "Tier", get: (m) => m.tier },
  { label: "Bioprinting approach", get: (m) => m.role },
  {
    label: "Extruders",
    get: (m) => {
      const s = spec(m, "extruder slot", "");
      if (s) return s;
      const n = spec(m, "number of extruders", "");
      if (n) return n;
      return m.slug === "trivima-aura" ? "Light engine" : "N/A";
    },
  },
  { label: "Build volume (mm)", get: (m) => spec(m, "build volume").replace(" (customizable)", "") },
  {
    label: "Bed temperature",
    get: (m) => spec(m, "bed temperature", "N/A"),
  },
  {
    label: "Pressure range",
    get: (m) => spec(m, "pressure range", m.slug === "trivima-aura" ? "Not applicable" : "N/A"),
  },
  { label: "Photo-crosslinking", get: (m) => spec(m, "photo-crosslinking") },
  {
    label: "Software",
    get: (m) =>
      m.softwareHref ? (
        <Link
          href={m.softwareHref}
          className="font-medium text-[var(--color-brand-strong)] hover:underline underline-offset-4"
        >
          {m.software}
        </Link>
      ) : (
        m.software
      ),
  },
  { label: "File formats", get: (m) => spec(m, "file formats") },
  {
    // Configurability is the range's main selling point, so it belongs in the
    // comparison rather than buried in each model page. Copy comes from the
    // machine's own `customisation` entry in lib/machines.ts.
    label: "Configured to your lab",
    get: (m) =>
      m.customisation ? (
        <span className="text-[var(--color-ink)]">
          {m.customisation.options.length} options specified with you
        </span>
      ) : (
        "N/A"
      ),
  },
];

const ORDER = ["trivima-np", "trivima-pro", "trivima-aura"];

export default function CompareTable() {
  const cols = ORDER.map((s) => machines.find((m) => m.slug === s)!).filter(Boolean);

  return (
    <section
      id="compare"
      aria-labelledby="compare-heading"
      className="py-20 lg:py-28 bg-[var(--color-surface-raised)] border-y border-[var(--color-hairline)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 max-w-2xl mb-12">
          <h2
            id="compare-heading"
            className="h2"
          >
            Compare the bioprinter range
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Side by side, where each bioprinter fits.
          </p>
        </div>

        {/* Phones: one card per bioprinter. A three-column table cannot fit a
            360px screen, and the horizontal scroller it used to need put the
            two other machines off-screen with no sign they were there. */}
        <div className="flex flex-col gap-4 md:hidden">
          {cols.map((m) => (
            <div
              key={m.slug}
              className="overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)]"
            >
              <Link
                href={`/machines/${m.slug}`}
                className="block border-b border-[var(--color-hairline)] px-5 py-4"
              >
                <span className="font-display text-[1.0625rem] font-semibold text-[var(--color-ink)]">
                  {m.name}
                </span>
              </Link>
              <dl className="flex flex-col">
                {ROWS.map((row, ri) => (
                  <div
                    key={row.label}
                    className={`flex items-baseline justify-between gap-5 px-5 py-3 ${
                      ri % 2 === 1 ? "bg-[var(--color-surface-raised)]/40" : ""
                    }`}
                  >
                    <dt className="shrink-0 text-[13px] text-[var(--color-ink-muted)]">
                      {row.label}
                    </dt>
                    <dd className="text-right text-[13px] leading-relaxed text-[var(--color-ink)]">
                      {row.get(m)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div
          data-lenis-prevent
          className="hidden overflow-x-auto overscroll-x-contain rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] scrollbar-hide md:block"
        >
          <table className="w-full border-collapse text-left min-w-[600px]">
            <caption className="sr-only">
              Comparison of the three Trivima bioprinter models across key specifications
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-[var(--color-surface)] px-5 py-5 align-bottom text-[12.5px] font-medium text-[var(--color-ink-faint)] border-b border-[var(--color-hairline)]"
                >
                  Specification
                </th>
                {cols.map((m) => (
                  <th
                    key={m.slug}
                    scope="col"
                    className="px-5 py-5 align-bottom border-b border-[var(--color-hairline)] border-l border-l-[var(--color-hairline-subtle)]"
                  >
                    <Link href={`/machines/${m.slug}`} className="group flex flex-col gap-1">
                      <span className="font-display text-[15px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-strong)] transition-colors whitespace-nowrap">
                        {m.name}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr
                  key={row.label}
                  className={ri % 2 === 1 ? "bg-[var(--color-surface-raised)]/40" : undefined}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-inherit px-5 py-4 text-[13px] font-medium text-[var(--color-ink-muted)] whitespace-nowrap"
                    style={{ backgroundColor: ri % 2 === 1 ? "var(--color-surface-raised)" : "var(--color-surface)" }}
                  >
                    {row.label}
                  </th>
                  {cols.map((m) => (
                    <td
                      key={m.slug}
                      className="px-5 py-4 text-[13px] text-[var(--color-ink)] border-l border-l-[var(--color-hairline-subtle)] align-top leading-relaxed"
                    >
                      {row.get(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
