"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed video backdrop for a page hero. Same scrim stack as
 * `PhotoHeroBackdrop`, so a hero can swap between the two without its copy
 * changing contrast: darken the media itself, then lay a directional gradient
 * over the side the copy sits on.
 *
 * The poster carries the first paint and is all anyone sees under
 * `prefers-reduced-motion`, where the video is never loaded at all. Everything
 * else about it is decoration: muted, looping, `playsInline` so iOS does not
 * take it fullscreen, and no controls.
 *
 * Drop this as the first child of a `relative isolate overflow-hidden` section
 * whose background is `--color-photo-ground`, and put the copy in a `relative`
 * wrapper after it.
 */
export default function VideoHeroBackdrop({
  /** Sources in preference order: WebM first, MP4 as the fallback. */
  webm,
  mp4,
  poster,
  /** Keeps the subject clear of the copy. */
  objectPosition = "65% center",
}: {
  webm?: string;
  mp4: string;
  poster: string;
  objectPosition?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  /* Decided after mount, so the server never renders a <video> that a
     reduced-motion reader would then have to download. */
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlay(true);
  }, []);

  useEffect(() => {
    if (!play) return;
    // Autoplay can still be refused (low power mode, a browser setting). The
    // poster stays underneath either way, so a rejection costs nothing.
    videoRef.current?.play().catch(() => {});
  }, [play]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition, filter: "brightness(0.72) saturate(0.98)" }}
      />

      {play ? (
        <video
          ref={videoRef}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition, filter: "brightness(0.72) saturate(0.98)" }}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}

      {/* Readability scrim: heavy where the copy starts, clearing toward the
          right so the footage is still legible. */}
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
          background:
            "linear-gradient(180deg, rgba(10,20,34,0.55) 0%, rgba(10,20,34,0) 42%)",
        }}
      />
    </>
  );
}
