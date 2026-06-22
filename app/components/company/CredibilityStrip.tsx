const FACTS = [
  { figure: "2016", label: "Founded in Bengaluru by engineers and biomedical scientists" },
  { figure: "8+ yrs", label: "Designing and shipping research bioprinters" },
  { figure: "600+", label: "Researchers trained through Next Big Learning" },
  { figure: "2023", label: "World Economic Forum Technology Pioneer" },
];

export default function CredibilityStrip() {
  return (
    <section aria-label="Company at a glance" className="border-y border-[var(--color-hairline)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-[var(--color-hairline-subtle)] lg:divide-y-0 lg:divide-x lg:divide-[var(--color-hairline-subtle)]">
          {FACTS.map((f) => (
            <div key={f.figure} className="flex flex-col gap-2 px-2 py-8 lg:px-8 lg:py-10 first:pl-0 lg:[&:nth-child(3)]:pl-2">
              <dd className="font-mono text-[1.9rem] lg:text-[2.4rem] font-medium tracking-tight text-[var(--color-ink)] leading-none">
                {f.figure}
              </dd>
              <dt className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed max-w-[26ch]">
                {f.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
