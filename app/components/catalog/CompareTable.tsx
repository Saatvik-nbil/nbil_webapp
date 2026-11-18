import Link from "next/link";
import { machines, type Machine } from "@/lib/machines";

// Pull a spec value by fuzzy label match, with a fallback.
function spec(m: Machine, keyword: string, fallback = "Not listed"): string {
  const hit = m.specs.find((s) => s.label.toLowerCase().includes(keyword.toLowerCase()));
  return hit ? hit.value : fallback;
}

/** Drop a trailing "(...)" note, so "4 °C to 80 °C (liquid-based cooling)" and
 *  "4 °C to 80 °C" count as the same value and merge into one cell. */
const clean = (value: string) => value.replace(/\s*\(.*\)\s*$/, "");

/** Values that say a spec doesn't apply, shown quieter than real figures. */
const QUIET_VALUES = new Set(["Not used", "Not listed", "Light engine"]);

type Row = {
  label: string;
  /** Plain text. Neighbouring machines with the same text share one cell. */
  get: (m: Machine) => string;
  render?: (m: Machine) => React.ReactNode;
};

type Group = { title: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    title: "Printing",
    rows: [
      { label: "Technology", get: (m) => spec(m, "technolog") },
      {
        label: "Extruder slots",
        get: (m) =>
          clean(spec(m, "extruder slot", "Light engine"))
            .replace(/ slots$/, "")
            .replace(/(\d) to (\d)/, "$1–$2"),
      },
      { label: "Build volume", get: (m) => spec(m, "build volume") },
      {
        label: "Precision",
        get: (m) => {
          const movement = spec(m, "movement precision", "");
          return movement
            ? `${movement} movement`
            : `${spec(m, "print resolution")} resolution`;
        },
      },
    ],
  },
  {
    title: "Materials",
    rows: [
      { label: "Extruder volumes", get: (m) => spec(m, "extruder volume", "Not used") },
      { label: "Pressure", get: (m) => spec(m, "pressure range", "Not used") },
      { label: "Bed temperature", get: (m) => clean(spec(m, "bed temperature")) },
      { label: "Crosslinking", get: (m) => spec(m, "photo-crosslinking") },
    ],
  },
  {
    title: "Software and files",
    rows: [
      {
        label: "Software",
        get: (m) => m.software,
        render: (m) =>
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
    ],
  },
];

const ORDER = ["trivima-np", "trivima-pro", "trivima-aura"];

/** Walks the columns and joins neighbours that hold the same value. */
function mergeCells(row: Row, cols: Machine[]) {
  const cells: { machine: Machine; span: number }[] = [];
  for (const machine of cols) {
    const last = cells[cells.length - 1];
    if (last && row.get(last.machine) === row.get(machine)) last.span += 1;
    else cells.push({ machine, span: 1 });
  }
  return cells;
}

// The spec column's tint separates the labels from the machine values. The
// hairline only matters once the table scrolls sideways under it.
const SPEC_COLUMN =
  "sticky left-0 z-10 bg-[var(--color-surface-raised)] border-r border-r-[var(--color-hairline)]";

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
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="bg-[var(--color-surface-raised)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-ink)]">
                    {group.title}
                  </h3>
                  <dl className="flex flex-col">
                    {group.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-5 border-t border-[var(--color-hairline)] px-5 py-3 first:border-t-0"
                      >
                        <dt className="shrink-0 text-[13px] text-[var(--color-ink-muted)]">
                          {row.label}
                        </dt>
                        <dd
                          className={`text-right text-[13px] leading-relaxed ${
                            QUIET_VALUES.has(row.get(m))
                              ? "text-[var(--color-ink-faint)]"
                              : "text-[var(--color-ink)]"
                          }`}
                        >
                          {row.render ? row.render(m) : row.get(m)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          data-lenis-prevent
          className="hidden overflow-x-auto overscroll-x-contain rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] scrollbar-hide md:block"
        >
          {/* border-separate: with collapsed borders, a sticky cell loses its
              rule as soon as the table scrolls. */}
          <table className="w-full table-fixed border-separate border-spacing-0 text-left min-w-[720px]">
            <caption className="sr-only">
              Comparison of the three Trivima bioprinter models across key specifications
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className={`${SPEC_COLUMN} w-[176px] px-5 py-5 align-bottom text-[15px] font-semibold text-[var(--color-ink)]`}
                >
                  Specification
                </th>
                {cols.map((m) => (
                  <th key={m.slug} scope="col" className="px-5 py-5 align-bottom">
                    <Link
                      href={`/machines/${m.slug}`}
                      className="font-display text-[15px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand-strong)] transition-colors whitespace-nowrap"
                    >
                      {m.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            {GROUPS.map((group, groupIndex) => (
              <tbody key={group.title}>
                {/* Each section opens on a full-width tinted band; that band is
                    the only heavy divider in the table. Later sections carry the
                    machine names again, so a reader partway down the table still
                    knows which column is which. The first sits directly under
                    the header, so it doesn't. */}
                <tr>
                  <th
                    scope="rowgroup"
                    className={`${SPEC_COLUMN} border-t border-t-[var(--color-hairline)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-ink)]`}
                  >
                    {group.title}
                  </th>
                  {groupIndex === 0 ? (
                    <td
                      colSpan={cols.length}
                      className="border-t border-t-[var(--color-hairline)] bg-[var(--color-surface-raised)]"
                    />
                  ) : (
                    cols.map((m) => (
                      <th
                        key={m.slug}
                        scope="col"
                        className="border-t border-t-[var(--color-hairline)] bg-[var(--color-surface-raised)] px-5 py-2.5 text-[12.5px] font-semibold text-[var(--color-ink-muted)] whitespace-nowrap"
                      >
                        {m.name}
                      </th>
                    ))
                  )}
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className={`${SPEC_COLUMN} border-t border-t-[var(--color-hairline)] px-5 py-3.5 text-[13px] font-medium text-[var(--color-ink-muted)] whitespace-nowrap`}
                    >
                      {row.label}
                    </th>
                    {mergeCells(row, cols).map(({ machine, span }) => {
                      const value = row.render ? row.render(machine) : row.get(machine);
                      return (
                        <td
                          key={machine.slug}
                          colSpan={span}
                          className={[
                            "border-t border-t-[var(--color-hairline)] text-[13px] leading-relaxed align-top",
                            // The shared value's bar is inset, so these padding
                            // pairs keep every row the same height.
                            span > 1 ? "px-3 py-2.5" : "px-5 py-3.5",
                            QUIET_VALUES.has(row.get(machine))
                              ? "text-[var(--color-ink-faint)]"
                              : "text-[var(--color-ink)]",
                          ].join(" ")}
                        >
                          {span > 1 ? (
                            <div className="rounded-md bg-[var(--color-brand-subtle)] px-2 py-1 text-center">
                              {value}
                            </div>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}
