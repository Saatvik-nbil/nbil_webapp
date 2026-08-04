"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

const FACTS = [
  { value: 2016, suffix: "", label: "Founded in Bengaluru by engineers and biomedical scientists" },
  { value: 10, suffix: "+ yrs", label: "Designing and shipping research bioprinters" },
  { value: 600, suffix: "+", label: "Researchers trained through Next Big Learning" },
  { value: 2023, suffix: "", label: "World Economic Forum Technology Pioneer" },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
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
    </span>
  );
}

export default function CredibilityStrip() {
  return (
    <section aria-label="Company at a glance" className="border-y border-[var(--color-hairline)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-[var(--color-hairline-subtle)] lg:divide-y-0 lg:divide-x lg:divide-[var(--color-hairline-subtle)]">
          {FACTS.map((f) => (
            <div key={f.label} className="flex flex-col gap-2 px-2 py-8 lg:px-8 lg:py-10 first:pl-0 lg:[&:nth-child(3)]:pl-2">
              <dd className="font-mono text-[1.9rem] lg:text-[2.4rem] font-medium tracking-tight text-[var(--color-ink)] leading-none tabular-nums">
                <CountUp value={f.value} suffix={f.suffix} />
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
