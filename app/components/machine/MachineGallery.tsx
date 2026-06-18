"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { MachineImage } from "@/lib/machines";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MachineGallery({
  images,
  name,
  role,
  year,
}: {
  images: MachineImage[];
  name: string;
  role: string;
  year: string;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = images[active] ?? images[0];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <div className="relative rounded-3xl border border-[var(--color-hairline)] bg-gradient-to-br from-[var(--color-surface-raised)] to-[var(--color-surface)] p-8 sm:p-10">
        <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-3 py-1 text-[11px] font-medium text-white">
          {role}
        </span>
        <span className="absolute top-5 right-5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-mono text-[var(--color-ink-muted)]">
          {year}
        </span>
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={760}
          height={760}
          priority
          className="mx-auto h-auto w-full max-w-[440px] object-contain drop-shadow-[0_24px_48px_rgba(15,23,42,0.18)]"
          sizes="(max-width: 1024px) 90vw, 45vw"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3" role="tablist" aria-label={`${name} images`}>
          {images.map((img, i) => (
            <button
              key={img.src}
              role="tab"
              aria-selected={i === active}
              aria-label={img.alt}
              onClick={() => setActive(i)}
              className={[
                "relative size-20 shrink-0 rounded-xl border bg-[var(--color-surface-raised)] p-2 transition-all cursor-pointer",
                i === active
                  ? "border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]/25"
                  : "border-[var(--color-hairline)] hover:border-[var(--color-ink-faint)]",
              ].join(" ")}
            >
              <Image
                src={img.src}
                alt=""
                width={120}
                height={120}
                className="h-full w-full object-contain"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
