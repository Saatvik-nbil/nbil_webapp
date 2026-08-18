"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

type Fact = { value: number; suffix: string; unit?: string; label: string };

const FACTS: Fact[] = [
  { value: 2016, suffix: "", label: "Founded in Bengaluru by engineers and biomedical scientists" },
  { value: 10, suffix: "+", unit: "years", label: "Designing and shipping research bioprinters" },
  { value: 600, suffix: "+", label: "Researchers trained in 3D bioprinting through Next Big Learning" },
  { value: 2023, suffix: "", label: "World Economic Forum Technology Pioneer" },
];

function CountUp({
  value,
  suffix,
  unit,
}: {
  value: number;
  suffix: string;
  /** Trailing word ("years"). Set smaller than the figure so a spelled-out
      unit still fits the two-column mobile cell. */
  unit?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
      {unit ? (
        <span className="ml-1.5 text-[0.45em] font-medium tracking-normal text-[var(--color-ink-muted)]">
          {unit}
        </span>
      ) : null}
    </span>
  );
}

export default function CredibilityStrip() {
  return (
    <section aria-label="Company at a glance" className="border-y border-[var(--color-hairline)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-[var(--color-hairline-subtle)] lg:divide-y-0 lg:divide-x lg:divide-[var(--color-hairline-subtle)]">
          {/* Every cell is inset from its divider by the same amount; only the
              cell that starts a row goes flush with the container edge. The
              mobile rule is scoped `max-lg:` so it cannot leak into the
              four-column layout, where cell 3 is mid-row, not row-start. */}
          {FACTS.map((f) => (
            <div key={f.label} className="flex flex-col gap-2 px-2 py-8 lg:px-8 lg:py-10 max-lg:[&:nth-child(odd)]:pl-0 lg:first:pl-0">
              <dd className="font-mono text-[1.9rem] lg:text-[2.4rem] font-medium tracking-tight text-[var(--color-ink)] leading-none tabular-nums">
                <CountUp value={f.value} suffix={f.suffix} unit={f.unit} />
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
