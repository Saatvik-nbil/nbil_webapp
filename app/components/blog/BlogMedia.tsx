"use client";

import { useReducedMotion } from "motion/react";
import { Image as ImageIcon, Film, PlayCircle } from "lucide-react";

export type MediaKind = "screenshot" | "gif" | "video";

type BlogMediaProps = {
  /** What eventually goes in this slot: drives the placeholder wording + icon. */
  kind?: MediaKind;
  /** Drop the real asset path here later (e.g. "/images/blog/dhee/import.gif").
   *  While it's undefined the placeholder renders instead. */
  src?: string;
  /** Poster frame for `kind="video"`. */
  poster?: string;
  /** Required once `src` is set: describes the media for screen readers. */
  alt?: string;
  /** Short line describing what this slot should show. */
  caption: string;
  /** Aspect ratio of the slot, e.g. "16/9" or "4/3". */
  ratio?: string;
};

const COPY: Record<MediaKind, { icon: typeof ImageIcon; label: string }> = {
  screenshot: { icon: ImageIcon, label: "Insert screenshot here" },
  gif: { icon: Film, label: "Insert GIF here" },
  video: { icon: PlayCircle, label: "Insert video here" },
};

export default function BlogMedia({
  kind = "screenshot",
  src,
  poster,
  alt = "",
  caption,
  ratio = "16/9",
}: BlogMediaProps) {
  const reduce = useReducedMotion();
  const { icon: Icon, label } = COPY[kind];

  // Empty slot: a labelled dropzone so it's obvious what belongs here.
  if (!src) {
    return (
      <figure className="flex flex-col gap-3">
        <div
          style={{ aspectRatio: ratio }}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-hairline)] bg-[var(--color-brand-subtle)] px-6 text-center"
        >
          <Icon
            className="h-8 w-8 text-[var(--color-brand)]/70"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
            {label}
          </p>
        </div>
        <figcaption className="text-[13px] leading-relaxed text-[var(--color-ink-faint)]">
          {caption}
        </figcaption>
      </figure>
    );
  }

  // Video keeps its controls; a looping clip supplied as .mp4 behaves like a GIF
  // but stays paused under reduced motion.
  const isVideo = kind === "video" || /\.(mp4|webm|mov)$/i.test(src);

  return (
    <figure className="flex flex-col gap-3">
      <div
        style={{ aspectRatio: ratio }}
        className="overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)]"
      >
        {isVideo ? (
          <video
            src={src}
            poster={poster}
            controls
            muted
            loop
            playsInline
            autoPlay={!reduce && kind !== "video"}
            preload="metadata"
            aria-label={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <figcaption className="text-[13px] leading-relaxed text-[var(--color-ink-faint)]">
        {caption}
      </figcaption>
    </figure>
  );
}
