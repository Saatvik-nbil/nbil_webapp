import Image from "next/image";

/**
 * Full-bleed photo backdrop for a page hero, with the scrim stack needed to keep
 * light copy readable over a bright lab photograph: darken the media itself,
 * then lay a directional gradient over the side the copy sits on.
 *
 * The photo runs edge to edge and meets the next section on a hard seam. There
 * is deliberately no bottom fade: heroes are full-viewport, and a fade tall
 * enough to hide the seam ate the half of the photograph the height was for.
 *
 * Drop this as the first child of a `relative isolate overflow-hidden` section
 * whose background is `--color-photo-ground`, and put the copy in a `relative` wrapper
 * after it. The section owns its own padding; this fills it.
 */
export default function PhotoHeroBackdrop({
  src,
  /** Keeps the photo's subject clear of the copy. */
  objectPosition = "65% center",
  /** Alt is empty by default: this is decoration, not content. */
  alt = "",
}: {
  src: string;
  objectPosition?: string;
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
      {/* Readability scrim: heavy where the copy starts, clearing toward the
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
    </>
  );
}
