"use client";

import React, { useEffect, useRef, type HTMLAttributes } from "react";

export interface GalleryItem {
  /** Leave undefined to render the empty slot. */
  src?: string;
  alt?: string;
  /** CSS object-position, e.g. "65% 35%". */
  pos?: string;
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Degrees per second. Rotation is autonomous and time-based. */
  speed?: number;
  /** Clear space between neighbouring cards, as a fraction of card width. */
  gap?: number;
  /**
   * Ring half-width as a fraction of the container's width, and the main size
   * lever. 0.5 fits the container exactly; above that the ring overhangs its
   * column, so only raise it where there is gutter to spend.
   */
  spread?: number;
  /** Aspect ratio of each card (height / width). */
  cardAspect?: number;
  /**
   * Camera distance in px. Lower exaggerates the depth difference between the
   * near and far side of the ring; higher flattens it toward an orthographic
   * look.
   */
  perspective?: number;
}

/**
 * Card width and ring radius are solved from the item count so neighbours can
 * never intersect, under two constraints:
 *
 *   radius + cardWidth / 2 = spread                    (ring half-width)
 *   2 * radius * sin(PI / n) = cardWidth * (1 + gap)   (arc spacing)
 *
 * Solving gives cardWidth = 2 * spread * s / (1 + gap + s), with
 * s = sin(PI / n). So card size scales directly with `spread` and shrinks as
 * items are added. The two levers for making the images bigger are a wider
 * spread and a lower count.
 */
function solveGeometry(count: number, gap: number, spread: number) {
  const s = Math.sin(Math.PI / Math.max(count, 2));
  const cardRatio = (2 * spread * s) / (1 + gap + s);
  return { cardRatio, radiusRatio: spread - cardRatio / 2 };
}

/* Hover-focus tuning. The pop is deliberately small: the ring already
   overhangs its column at the default spread, and translateZ compounds with
   the perspective scale, so a card gains noticeably more than these numbers
   suggest by the time it reaches the screen. */
const POP_Z = 44;
const POP_SCALE = 1.05;
/* The bezier form of easeInOutCubic, so the pop and the ring that carries it
   are running the same curve. */
const POP_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const POP_MS = 460;
const POP_SHADOW = "0 40px 70px -30px rgba(15, 23, 42, 0.55)";
/* The pop starts a little before the ring finishes settling. Waiting for the
   full snap reads as two disconnected steps; this overlap hands one motion to
   the next while still clearly arriving before it lifts. */
const POP_OVERLAP = 0.8;
/* Grace period before the ring resumes spinning. The snap slides the card out
   from under a stationary cursor for a frame or two, which would otherwise
   read as a leave/enter flicker. */
const RELEASE_MS = 140;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Eased rotation from the free spin to a card's front-facing angle. */
type Snap = { from: number; to: number; elapsed: number; duration: number };

/**
 * A ring of images rotating continuously about the Y axis.
 *
 * Every card stays fully opaque through the whole revolution. Depth reads
 * from perspective scaling alone, and cards on the far side are occluded by
 * nearer ones through `preserve-3d` z-sorting rather than by fading out. Each
 * card is double-sided so the far half shows a correctly oriented image
 * instead of a mirrored back.
 *
 * Pointing at a card takes over the rotation: the ring eases around the
 * shortest way, reversing if that is nearer, until the card faces the
 * viewer, then the card pops forward. Leaving resumes the free spin from
 * whatever angle it was holding, so there is no jump back.
 *
 * The loop writes a single transform to the track per frame, no React state
 * and no per-item style writes, so it stays smooth alongside the GSAP/Lenis
 * work already running on this page.
 */
const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      speed = 12,
      gap = 0.14,
      // Above 0.5 the ring is wider than its container, but only a card at
      // 90deg reaches that extreme and it is edge-on there, projected to
      // nothing. The widest a card actually appears is around 55deg, well
      // inside this figure.
      spread = 0.7,
      cardAspect = 1.55,
      perspective = 1000,
      ...props
    },
    ref,
  ) => {
    const stageRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    // The pop lives on a wrapper inside each card, so it composes with the
    // card's ring placement instead of fighting it for the transform.
    const popRefs = useRef<(HTMLDivElement | null)[]>([]);
    const count = items.length;

    useEffect(() => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track || count === 0) return;

      const { cardRatio, radiusRatio } = solveGeometry(count, gap, spread);

      // Size the ring from the container so it adapts to its column.
      // NOTE: these names are prefixed. `--radius` is a shadcn design token
      // here (`--radius-2xl` is derived from it), so setting it would inherit
      // down and round the cards into ovals.
      let lastWidth = -1;
      const layout = () => {
        const width = stage.clientWidth || 1;
        if (width === lastWidth) return;
        lastWidth = width;
        const cardW = Math.round(width * cardRatio);
        stage.style.setProperty("--cg-card-w", `${cardW}px`);
        stage.style.setProperty("--cg-card-h", `${Math.round(cardW * cardAspect)}px`);
        stage.style.setProperty("--cg-radius", `${Math.round(width * radiusRatio)}px`);
      };

      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(stage);
      layout();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        track.style.transform = "rotateY(0deg)";
        return () => resizeObserver.disconnect();
      }

      let frame = 0;
      let last = performance.now();
      let rotation = 0;
      let snap: Snap | null = null;
      let activeIndex: number | null = null;
      let releaseTimer: ReturnType<typeof setTimeout> | null = null;

      const loop = (now: number) => {
        // Clamp dt so a backgrounded tab doesn't jump on return.
        const dtMs = Math.min(now - last, 100);
        last = now;
        if (snap) {
          // Progress is accumulated rather than read off the clock, so a
          // paused loop (tab hidden, ring scrolled away) resumes mid-snap
          // instead of finding the tween already expired.
          snap.elapsed = Math.min(snap.elapsed + dtMs, snap.duration);
          const t = snap.duration > 0 ? snap.elapsed / snap.duration : 1;
          rotation = snap.from + (snap.to - snap.from) * easeInOutCubic(t);
        } else {
          // Wrapping keeps float precision stable over a long session; 359.9 and
          // 0.1 deg are the same pose, so the wrap itself is invisible.
          rotation = (rotation + speed * (dtMs / 1000)) % 360;
        }
        track.style.transform = `rotateY(${rotation}deg)`;
        frame = requestAnimationFrame(loop);
      };

      const start = () => {
        if (frame) return;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        if (!frame) return;
        cancelAnimationFrame(frame);
        frame = 0;
      };

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { rootMargin: "80px" },
      );
      intersectionObserver.observe(stage);

      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);

      // --- Hover focus -----------------------------------------------------

      /** `delayMs` holds the pop back until the ring has finished turning. */
      const setPop = (index: number, on: boolean, delayMs = 0) => {
        const node = popRefs.current[index];
        if (!node) return;
        node.style.transitionDelay = `${Math.round(delayMs)}ms`;
        node.style.transform = on
          ? `translateZ(${POP_Z}px) scale(${POP_SCALE})`
          : "translateZ(0px) scale(1)";
        node.style.boxShadow = on ? POP_SHADOW : "0 0 0 0 rgba(15, 23, 42, 0)";
      };

      const focus = (index: number) => {
        if (activeIndex === index) return;
        if (activeIndex !== null) setPop(activeIndex, false);
        activeIndex = index;

        // Card `index` sits at (360 / count) * index inside the track, so it
        // faces the viewer once the track is at the negation of that. Fold the
        // difference into (-180, 180] to take the shorter way round. A
        // negative result means the ring visibly reverses, which is the point.
        const raw = -(360 / count) * index - rotation;
        const signed = (((raw % 360) + 540) % 360) - 180;
        const distance = Math.abs(signed);
        // Scaled by how far the ring has to travel, and generous either way:
        // the idle spin is only 12deg/s, so a turn that covers 180deg in much
        // under a second reads as a lurch rather than a glide.
        const duration = distance < 1 ? 0 : 320 + (distance / 180) * 1000;

        snap = { from: rotation, to: rotation + signed, elapsed: 0, duration };
        setPop(index, true, duration * POP_OVERLAP);
      };

      const blur = () => {
        if (activeIndex === null) return;
        setPop(activeIndex, false);
        activeIndex = null;
        snap = null;
        // Re-enter the free spin on a wrapped angle; the snap target may have
        // wandered outside 0–360 while it ran.
        rotation = ((rotation % 360) + 360) % 360;
      };

      const cancelRelease = () => {
        if (releaseTimer === null) return;
        clearTimeout(releaseTimer);
        releaseTimer = null;
      };
      const scheduleRelease = () => {
        if (activeIndex === null || releaseTimer !== null) return;
        releaseTimer = setTimeout(() => {
          releaseTimer = null;
          blur();
        }, RELEASE_MS);
      };

      // Delegated, so sliding between neighbouring cards re-targets in one
      // event rather than a leave/enter pair that would restart the spin.
      const onPointerOver = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        const card = (event.target as Element | null)?.closest?.("[data-cg-card]");
        const index = card ? Number(card.getAttribute("data-cg-card")) : NaN;
        if (Number.isNaN(index)) {
          scheduleRelease();
          return;
        }
        cancelRelease();
        focus(index);
      };
      const onPointerLeave = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        scheduleRelease();
      };

      stage.addEventListener("pointerover", onPointerOver);
      stage.addEventListener("pointerleave", onPointerLeave);

      return () => {
        stop();
        cancelRelease();
        if (activeIndex !== null) setPop(activeIndex, false);
        stage.removeEventListener("pointerover", onPointerOver);
        stage.removeEventListener("pointerleave", onPointerLeave);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, [count, speed, gap, spread, cardAspect]);

    const face =
      "absolute inset-0 overflow-hidden rounded-[10px] bg-[var(--color-surface-raised)] shadow-[0_18px_40px_-18px_rgba(15,23,42,0.45)] [backface-visibility:hidden]";

    const renderFace = (item: GalleryItem) =>
      item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: item.pos ?? "center" }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-faint)]">
            Image
          </span>
        </div>
      );

    return (
      <div
        ref={ref}
        role="img"
        aria-label="Rotating gallery of bioprinting images"
        className={["relative w-full", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div
          ref={stageRef}
          aria-hidden="true"
          className="relative aspect-square w-full"
          style={{ perspective: `${perspective}px` }}
        >
          <div
            ref={trackRef}
            className="absolute inset-0 will-change-transform [transform-style:preserve-3d]"
          >
            {items.map((item, i) => (
              <div
                key={i}
                data-cg-card={i}
                className="absolute left-1/2 top-1/2 h-[var(--cg-card-h)] w-[var(--cg-card-w)] [transform-style:preserve-3d]"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${
                    (360 / count) * i
                  }deg) translateZ(var(--cg-radius))`,
                }}
              >
                {/* Pop wrapper. Kept separate from the card above so the hover
                    lift never has to re-derive the ring placement, and its
                    rounding matches the faces so the lift shadow tracks them. */}
                <div
                  ref={(el) => {
                    popRefs.current[i] = el;
                  }}
                  className="absolute inset-0 rounded-[10px] [transform-style:preserve-3d]"
                  style={{
                    transform: "translateZ(0px) scale(1)",
                    boxShadow: "0 0 0 0 rgba(15, 23, 42, 0)",
                    transition: `transform ${POP_MS}ms ${POP_EASE}, box-shadow ${POP_MS}ms ${POP_EASE}`,
                  }}
                >
                  {/* Two faces: the back one is pre-flipped, so the far side of
                      the ring shows the image the right way round rather than a
                      mirrored reflection. */}
                  <div
                    className={`${face} ${
                      item.src ? "border" : "border border-dashed"
                    } border-[var(--color-hairline)]`}
                  >
                    {renderFace(item)}
                  </div>
                  <div
                    className={`${face} [transform:rotateY(180deg)] ${
                      item.src ? "border" : "border border-dashed"
                    } border-[var(--color-hairline)]`}
                  >
                    {renderFace(item)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
