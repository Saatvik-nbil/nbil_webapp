import Image from "next/image";
import { BackdropDrift } from "@/app/components/motion/ScrollFx";

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
const SCRIMS = {
  standard: {
    quality: undefined,
    sizes: "100vw",
    filter: "brightness(0.72) saturate(0.98)",
    blend: "normal",
    copy: "linear-gradient(90deg, rgba(10,20,34,0.90) 0%, rgba(10,20,34,0.70) 44%, rgba(10,20,34,0.22) 72%, rgba(10,20,34,0.06) 100%)",
    nav: "linear-gradient(180deg, rgba(10,20,34,0.55) 0%, rgba(10,20,34,0) 42%)",
  },
  /** Multiplies instead of overlaying, so blacks stay black and the photo keeps
      its contrast rather than going milky. Served at higher quality, and sized for
      object-cover: on a tall viewport a 3:2 photo renders at 150vh wide, wider than
      the viewport, so "100vw" would pick a file too small and stretch it. */
  clear: {
    quality: 90,
    sizes: "max(100vw, 150vh)",
    filter: "brightness(0.92) contrast(1.06)",
    blend: "multiply",
    copy: "linear-gradient(90deg, rgba(10,20,34,0.80) 0%, rgba(10,20,34,0.64) 50%, rgba(10,20,34,0.20) 75%, rgba(10,20,34,0) 100%)",
    nav: "linear-gradient(180deg, rgba(10,20,34,0.45) 0%, rgba(10,20,34,0) 30%)",
  },
} as const;

export default function PhotoHeroBackdrop({
  src,
  /** Keeps the photo's subject clear of the copy. */
  objectPosition = "65% center",
  /** Alt is empty by default: this is decoration, not content. */
  alt = "",
  scrim = "standard",
}: {
  src: string;
  objectPosition?: string;
  alt?: string;
  scrim?: keyof typeof SCRIMS;
}) {
  const { quality, sizes, filter, blend, copy, nav } = SCRIMS[scrim];

  return (
    <>
      {/* Drifts slower than the page as the hero scrolls away. */}
      <BackdropDrift>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={quality}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition, filter }}
        />
      </BackdropDrift>
      {/* Readability scrim: heavy where the copy starts, clearing toward the
          right so the photograph is still legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: copy,
          mixBlendMode: blend,
        }}
      />
      {/* Darkens under the fixed navbar so the glass pill stays legible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: nav,
          mixBlendMode: blend,
        }}
      />
    </>
  );
}
