/**
 * The three colours of the nbil mark, as a small standing graphic.
 *
 * It started life at the top of the landing hero's copy panel and is now the
 * thing that marks the top of a hero and the top of a form, so a reader meets
 * the same sign wherever the page asks for their attention.
 *
 * Decoration only: it carries no text, so it is hidden from assistive tech.
 * Amber never carries type anywhere on the site (1.7:1 on white); here it is
 * a fill, which is the one place it is allowed.
 */

const NBIL = {
  indigo: "#2c30a0",
  magenta: "#c40064",
  amber: "#ffb92b",
} as const;

/** `light` for the version that has to hold up on a dark photo hero. */
export default function BrandDots({
  className = "",
  size = 10,
  tone = "brand",
}: {
  className?: string;
  /** Dot diameter in px. */
  size?: number;
  tone?: "brand" | "light";
}) {
  const dots =
    tone === "light"
      ? ["#ffc95a", "#8d91ff", "#ff6fae"]
      : [NBIL.amber, NBIL.indigo, NBIL.magenta];

  return (
    <span
      aria-hidden="true"
      className={`flex items-center gap-1.5 ${className}`.trim()}
    >
      {dots.map((colour) => (
        <span
          key={colour}
          className="rounded-full"
          style={{ background: colour, width: size, height: size }}
        />
      ))}
    </span>
  );
}
