"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FaLinkedinIn } from "react-icons/fa";
import TeamShowcase, { type TeamMember } from "@/components/ui/team-showcase";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The three founders — shown first, as the anchor of the page. */
const FOUNDERS = [
  { id: "f1", name: "Piyush Padmanabhan", role: "CEO · Co-Founder & Director", image: "/founders/Piyush.png", linkedin: "https://www.linkedin.com/in/piyush-padmanabhan/" },
  { id: "f2", name: "Pooja Venkatesh", role: "Co-CEO · Co-Founder", image: "/founders/Pooja.jpg", linkedin: "https://www.linkedin.com/in/pooja-venkatesh-5a8079153/" },
  { id: "f3", name: "Alok Medikepura Anil", role: "Co-Founder & Director", image: "/founders/Alok.jpg", linkedin: "https://www.linkedin.com/in/alokanil/" },
];

/* The wider team — revealed in the showcase as you scroll down. */
const TEAM: TeamMember[] = [
  { id: "t2", name: "Muthukumaran V", role: "Senior Software & R&D Engineer", image: "/team/Muthu.webp", social: { linkedin: "https://www.linkedin.com/in/muthukumaran-v-48a411224/" } },
  { id: "t1", name: "Gowthaman S P", role: "Senior R&D Engineer", image: "/team/Gowthaman-Photoroom.jpeg", social: { linkedin: "https://www.linkedin.com/in/gowthaman2/" } },
  { id: "t3", name: "Maria Da Costa", role: "Biofabrication Specialist", image: "/team/MariaDC.webp", social: { linkedin: "https://www.linkedin.com/in/maria-dacosta/" } },
  { id: "t4", name: "Aseem Gupta", role: "Jr. Engineer · Software & AI", image: "/team/Aseem Gupta.jpeg", social: { linkedin: "https://www.linkedin.com/in/theaseemgupta/" } },
  { id: "t5", name: "Saatvik S Shastry", role: "Jr. Engineer · Software & AI", image: "/team/Saatvik.jpeg", social: { linkedin: "https://www.linkedin.com/in/saatvik-shastry-a9a38a212/" } },
  { id: "t6", name: "Gargi Chakraborty", role: "Marketing & Ops Associate", image: "/team/Gargi.webp", social: { linkedin: "https://www.linkedin.com/in/gargichakraborty14/" } },
  { id: "t7", name: "Aalim Hussain", role: "Mechanical Engineer", image: "/team/Aalim.png", social: { linkedin: "https://www.linkedin.com/in/aalim-hussain-mechanical-engineer/" } },
  { id: "t8", name: "Snehangshu Sengupta", role: "Mechanical Engineer", image: "/team/Snehangshu.jpg", social: { linkedin: "https://www.linkedin.com/in/snehangshu-sengupta-9251091b1/" } },
  { id: "t9", name: "Pooja H P", role: "Biofabrication Intern", image: "/team/PoojaHP.webp", social: { linkedin: "https://www.linkedin.com/in/pooja-h-p-8a2251214/" } },
];

export default function TeamLanding() {
  const reduce = useReducedMotion();
  const [hoveredFounder, setHoveredFounder] = useState<string | null>(null);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { delay, duration: 0.6, ease: EASE },
        };

  return (
    <main id="main-content" className="bg-[var(--color-canvas)]">
      {/* ── Founders ── */}
      <section
        aria-labelledby="team-heading"
        className="relative mx-auto max-w-6xl px-6 pt-32 pb-16 lg:pt-40 lg:pb-24"
      >
        <motion.p
          {...rise(0)}
          className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]"
        >
          Our team
        </motion.p>
        <motion.h1
          id="team-heading"
          {...rise(0.06)}
          className="mt-4 max-w-[20ch] font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] sm:text-[3.25rem] lg:text-[3.75rem]"
        >
          The people printing a better future
        </motion.h1>
        <motion.p
          {...rise(0.12)}
          className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]"
        >
          NBIL pairs hard engineering with biomedical science. Meet the founders who
          set the direction, and the team that builds the Trivima range every day.
        </motion.p>

        {/* Founder cards */}
        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-3 lg:gap-8">
          {FOUNDERS.map((f, i) => {
            const isActive = hoveredFounder === f.id;
            const isDimmed = hoveredFounder !== null && !isActive;
            return (
              <motion.div
                key={f.id}
                {...rise(0.18 + i * 0.08)}
                onMouseEnter={() => setHoveredFounder(f.id)}
                onMouseLeave={() => setHoveredFounder(null)}
                className={`group flex flex-col gap-4 transition-opacity duration-300 ${
                  isDimmed ? "opacity-60" : "opacity-100"
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-raised)]">
                  <Image
                    src={f.image}
                    alt={f.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="object-cover object-top transition-[filter,transform] duration-500 group-hover:scale-[1.03]"
                    style={{
                      filter: isActive
                        ? "grayscale(0) brightness(1)"
                        : "grayscale(1) brightness(0.94)",
                    }}
                  />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-display text-[1.2rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
                      {f.name}
                    </h2>
                    <p className="text-[13px] text-[var(--color-ink-muted)]">{f.role}</p>
                  </div>
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${f.name} on LinkedIn`}
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-hairline)] text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-surface)] hover:text-[var(--color-brand-strong)]"
                  >
                    <FaLinkedinIn size={13} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── The wider team (revealed on scroll) ── */}
      <section
        aria-labelledby="wider-team-heading"
        className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-16 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...rise(0)} className="flex flex-col gap-4">
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              The team
            </p>
            <h2
              id="wider-team-heading"
              className="max-w-[24ch] font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[2.5rem]"
            >
              Engineers, scientists and makers behind every print
            </h2>
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              Meet the Team
            </p>
          </motion.div>

          <div className="mt-8">
            <TeamShowcase members={TEAM} />
          </div>
        </div>
      </section>
    </main>
  );
}
