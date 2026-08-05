import { COMPANY } from "@/lib/machines";

/**
 * The company name with its registered-trademark mark. Use this anywhere the
 * full name is visible on-page; import COMPANY.name directly for metadata,
 * OpenGraph and JSON-LD, which must stay free of the glyph.
 *
 * The default 0.7em suits 15-17px body copy. Raise symbolClassName on smaller
 * type (the home hero eyebrow is 12px mono, where 0.7em renders at ~8px).
 */
export function CompanyName({
  className,
  symbolClassName = "text-[0.7em]",
}: {
  className?: string;
  symbolClassName?: string;
}) {
  return (
    <span className={className}>
      {COMPANY.name}
      <sup className={`ml-[0.12em] leading-none ${symbolClassName}`}>&reg;</sup>
    </span>
  );
}

export default CompanyName;
