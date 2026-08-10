import Image from "next/image";

/**
 * Full-bleed photo backdrop for a page hero, with the scrim stack needed to keep
 * light copy readable over a bright lab photograph. Follows the treatment
 * established by `consultancy/ConsultancyHero.tsx`: darken the media itself,
 * then lay a directional gradient over the side the copy sits on, then fade the
 * bottom edge into whatever section follows.
 *
 * Drop this as the first child of a `relative isolate overflow-hidden` section
 * whose background is `--color-dark-bg`, and put the copy in a `relative` wrapper
 * after it. The section owns its own padding; this fills it.
 */
export default function PhotoHeroBackdrop({
  src,
  /** Keeps the photo's subject clear of the copy. */
  objectPosition = "65% center",
  /**
   * Colour the bottom edge settles into, as a bare `r, g, b` triple so the fade
   * can end at zero alpha *of that colour*. A plain `transparent` keyword would
   * interpolate through transparent-black and leave a grey band above the seam.
   * Pass the dark-bg triple to land the photo on a dark base, or the following
   * section's colour to dissolve the seam into it.
   */
  fadeTo,
  /**
   * How much of the section's height the bottom seam fade covers. Content-height
   * heroes can afford the default; viewport-height ones want less, or the fade
   * eats the half of the photograph you made the hero tall to show.
   */
  fadeHeight = "45%",
  /** Alt is empty by default — this is decoration, not content. */
  alt = "",
}: {
  src: string;
  objectPosition?: string;
  fadeTo: string;
  fadeHeight?: string;
  alt?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition, filter: "brightness(0.72) saturate(0.98)" }}
      />
      {/* Readability scrim — heavy where the copy starts, clearing toward the
          right so the photograph is still legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,20,34,0.90) 0%, rgba(10,20,34,0.70) 44%, rgba(10,20,34,0.22) 72%, rgba(10,20,34,0.06) 100%)",
        }}
      />
      {/* Darkens under the fixed navbar so the glass pill stays legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(10,20,34,0.55) 0%, rgba(10,20,34,0) 42%)",
        }}
      />
      {/* Bottom seam: fades to the next section's exact colour, held at zero
          alpha of that same colour so no grey creeps in. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: fadeHeight,
          // Weighted late: the ramp stays faint through most of its height and
          // only commits near the bottom, so the photograph survives the fade.
          // It still lands on a full-opacity stop — anything less leaves a
          // visible edge where the hero meets the section below.
          background: `linear-gradient(180deg, rgba(${fadeTo},0) 0%, rgba(${fadeTo},0.18) 52%, rgba(${fadeTo},0.6) 82%, rgba(${fadeTo},1) 100%)`,
        }}
      />
    </>
  );
}
