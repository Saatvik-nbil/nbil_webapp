import Link from "next/link";
import { machines, type Machine } from "@/lib/machines";

// Pull a spec value by fuzzy label match, with a fallback.
function spec(m: Machine, keyword: string, fallback = "—"): string {
  const hit = m.specs.find((s) => s.label.toLowerCase().includes(keyword.toLowerCase()));
  return hit ? hit.value : fallback;
}

type Row = { label: string; get: (m: Machine) => string };

const ROWS: Row[] = [
  { label: "Tier", get: (m) => m.tier },
  { label: "Build approach", get: (m) => m.role },
  {
    label: "Extruders",
    get: (m) => {
      const s = spec(m, "extruder slot", "");
      if (s) return s;
      const n = spec(m, "number of extruders", "");
      if (n) return n;
      return m.slug === "trivima-aura" ? "Light engine (no extruder)" : "—";
    },
  },
  { label: "Build volume (mm)", get: (m) => spec(m, "build volume").replace(" (customizable)", "") },
  {
    label: "Bed temperature",
    get: (m) => spec(m, "bed temperature"),
  },
  {
    label: "Pressure range",
    get: (m) => spec(m, "pressure range", m.slug === "trivima-aura" ? "Not applicable" : "—"),
  },
  { label: "Photo-crosslinking", get: (m) => spec(m, "photo-crosslinking") },
  { label: "Software", get: (m) => m.software },
  { label: "File formats", get: (m) => spec(m, "file formats") },
];

const ORDER = [
  "trivima-np",
  "trivima-aura",
];

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
            className="font-display text-[2rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.12]"
          >
            Compare the range
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Side by side, where each system fits. Scroll horizontally on smaller screens.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] scrollbar-hide">
          <table className="w-full border-collapse text-left min-w-[480px]">
            <caption className="sr-only">
              Comparison of the two Trivima bioprinter models across key specifications
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 bg-[var(--color-surface)] px-5 py-5 align-bottom text-[12px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-faint)] border-b border-[var(--color-hairline)]"
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
                      <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--color-ink-faint)]">
                        {m.year}
                      </span>
                      <span className="font-display text-[15px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors whitespace-nowrap">
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
