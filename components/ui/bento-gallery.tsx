"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
export interface MediaItem {
  id: number;
  type: "image" | "video";
  title: string;
  desc: string;
  url: string;
  /** Tailwind col/row span classes e.g. "md:col-span-2 md:row-span-3" */
  span: string;
}

/* ── Individual media renderer ──────────────────────────────────── */
function MediaCell({
  item,
  className = "",
  onClick,
}: {
  item: MediaItem;
  className?: string;
  onClick?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (item.type !== "video" || !videoRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "80px", threshold: 0.1 }
    );
    obs.observe(videoRef.current);
    return () => obs.disconnect();
  }, [item.type]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [inView]);

  if (item.type === "video") {
    return (
      <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline muted loop preload="auto"
        >
          <source src={item.url} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      className={`${className} object-cover cursor-pointer`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
}

/* ── Lightbox modal ─────────────────────────────────────────────── */
function Lightbox({
  item,
  items,
  onClose,
  onSelect,
}: {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onSelect: (i: MediaItem) => void;
}) {
  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(17,8,32,0.80)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="relative max-w-4xl w-[92vw] rounded-2xl overflow-hidden"
          style={{
            background: "rgba(248,247,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main image */}
          <div className="aspect-video w-full bg-black/30">
            <MediaCell item={item} className="w-full h-full" />
          </div>

          {/* Caption */}
          <div className="px-6 py-4" style={{ background: "rgba(17,8,32,0.55)" }}>
            <p className="text-[13px] font-mono uppercase tracking-[0.1em] text-[#a78bfa] mb-1">
              {item.type === "video" ? "Video" : "Photo"}
            </p>
            <h3 className="text-white text-lg font-semibold">{item.title}</h3>
            <p className="text-white/60 text-sm mt-1">{item.desc}</p>
          </div>

          {/* Strip of thumbnails */}
          <div
            className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
            style={{ background: "rgba(17,8,32,0.45)" }}
          >
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => onSelect(it)}
                className={`shrink-0 size-12 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                  it.id === item.id
                    ? "border-[var(--color-brand)] scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <MediaCell item={it} className="w-full h-full" />
              </button>
            ))}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 size-8 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            aria-label="Close"
          >
            <X size={14} className="text-white" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main bento grid ────────────────────────────────────────────── */
interface BentoGalleryProps {
  items: MediaItem[];
  title?: string;
  description?: string;
}

export default function BentoGallery({ items, title, description }: BentoGalleryProps) {
  const [selected, setSelected] = useState<MediaItem | null>(null);

  return (
    <>
      {selected && (
        <Lightbox
          item={selected}
          items={items}
          onClose={() => setSelected(null)}
          onSelect={setSelected}
        />
      )}

      <div className="w-full">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[2rem] lg:text-[2.5rem] font-display font-semibold tracking-[-0.025em] text-[var(--color-ink)]"
              >
                {title}
              </motion.h2>
            )}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="mt-2 text-[var(--color-ink-muted)] text-[1.0625rem]"
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[70px]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${item.span}`}
              variants={{
                hidden:  { opacity: 0, y: 28, scale: 0.94 },
                visible: {
                  opacity: 1, y: 0, scale: 1,
                  transition: { type: "spring", stiffness: 320, damping: 26, delay: i * 0.04 },
                },
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(item)}
            >
              <MediaCell item={item} className="absolute inset-0 w-full h-full" />

              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-3"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="relative">
                  <p className="text-white text-[13px] font-semibold leading-tight line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-white/65 text-[11px] mt-0.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
