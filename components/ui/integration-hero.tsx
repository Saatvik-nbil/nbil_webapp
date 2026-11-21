"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { OriginButton } from "@/components/ui/origin-button";
import { FEATURED_PRESS, FEATURED_VIDEOS } from "@/lib/press";

// "Recognised where it counts": six citations on the left, a partition, and
// the founders' talks on the right. The full list of coverage and videos
// lives on /news; both read from lib/press.

const LABEL =
  "text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-faint)]";

export default function IntegrationHero() {
  return (
    <section
      aria-labelledby="recognition-heading"
      className="relative overflow-hidden border-y border-[var(--color-hairline)] bg-[var(--color-canvas)] py-20 lg:py-24"
    >
      {/* subtle dotted grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle at center, var(--color-hairline-subtle) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(black, transparent 92%)",
          WebkitMaskImage: "linear-gradient(black, transparent 92%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-12 lg:mb-14 flex flex-col gap-4 max-w-2xl">
          <h2 id="recognition-heading" className="h2">
            Recognised where it counts
          </h2>
          <p className="text-[1.0625rem] text-[var(--color-ink-muted)] leading-relaxed text-pretty">
            Trivima bioprinters are featured across national and international
            media publications and developed alongside leading research and
            clinical institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_1px_minmax(0,1fr)] lg:gap-12">
          {/* Citations */}
          <div className="flex flex-col gap-5">
            <h3 className={LABEL}>In the news</h3>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
              {FEATURED_PRESS.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5 shadow-[0_1px_2px_rgba(2,12,27,0.04)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(2,12,27,0.09)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-semibold text-[var(--color-ink)]">{p.outlet}</span>
                        <span className="text-[12.5px] text-[var(--color-ink-faint)]">{p.date}</span>
                      </div>
                      <ArrowUpRight
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="mt-0.5 shrink-0 text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-brand)]"
                      />
                    </div>
                    <span className="text-[15px] font-medium leading-snug text-[var(--color-ink-muted)] transition-colors group-hover:text-[var(--color-ink)]">
                      {p.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partition */}
          <div aria-hidden="true" className="h-px bg-[var(--color-hairline)] lg:h-auto lg:w-px" />

          {/* Founders' talks */}
          <div className="flex flex-col gap-5">
            <h3 className={LABEL}>Hear from our founders</h3>
            <ul className="flex flex-col gap-5" role="list">
              {FEATURED_VIDEOS.map((v) => (
                <li
                  key={v.id}
                  className="overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-[0_1px_2px_rgba(2,12,27,0.04)]"
                >
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      className="h-full w-full"
                      frameBorder={0}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 px-5 py-4">
                    <span className="text-[14px] font-semibold text-[var(--color-ink)]">{v.speakers}</span>
                    <span className="text-[12.5px] text-[var(--color-ink-faint)]">{v.source}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex">
          <OriginButton href="/news" className="px-6 font-semibold">
            Know more
            <ArrowRight size={16} weight="bold" />
          </OriginButton>
        </div>
      </div>
    </section>
  );
}
