"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  GraduationCap,
  UsersThree,
  ChartLineUp,
  Trophy,
  Scales,
  Sparkle,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { COMPANY } from "@/lib/machines";
import { CompanyName } from "@/app/components/CompanyName";

/**
 * Careers, at the foot of the team page. There is no separate /careers route
 * any more: joining the team and meeting the team are the same story, so the
 * pitch sits directly under the faces it is recruiting alongside. `/careers`
 * redirects here (see next.config.ts) and the anchor is `#careers`.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const BENEFITS = [
  {
    icon: GraduationCap,
    title: "Professional development",
    body: "Continuous learning, workshops and mentorship, so you stay ahead in your field while you build here.",
  },
  {
    icon: UsersThree,
    title: "Great co-workers",
    body: "Dedicated professionals who are not just colleagues but friends, in an inclusive and collaborative environment.",
  },
  {
    icon: ChartLineUp,
    title: "Room to grow",
    body: "Promotions, lateral moves and new specialisms: many paths to your full potential, not one ladder.",
  },
  {
    icon: Trophy,
    title: "Recognition",
    body: "Your work will not go unnoticed. We celebrate the contributions that move the company forward.",
  },
  {
    icon: Scales,
    title: "Work-life balance",
    body: "Flexible hours and remote options, because a fulfilling career should leave room for a life.",
  },
  {
    icon: Sparkle,
    title: "A culture worth keeping",
    body: "Welcoming, inventive and open, where your ideas and your individuality both count.",
  },
];

export default function CareersSection() {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { delay, duration: 0.6, ease: EASE },
  });

  return (
    <section
      id="careers"
      aria-labelledby="careers-heading"
      className="scroll-mt-28 border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* The line that carries the section. Deliberately the largest type on
            the page after the team's own title. */}
        <motion.div {...rise()} className="flex flex-col gap-5">
          <span className="eyebrow text-[var(--color-brand-strong)]">Careers at NBIL</span>
          <h2
            id="careers-heading"
            className="max-w-[16ch] font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--color-ink)]"
          >
            Learning from life.
            <br />
            And each other.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-10 border-t border-[var(--color-hairline)] pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16 lg:pt-12">
          <motion.div
            {...rise(0.06)}
            className="flex max-w-2xl flex-col gap-5 text-[15.5px] leading-[1.75] text-[var(--color-ink-muted)]"
          >
            <p>
              At <CompanyName />, we believe in dreaming big, working hard, working
              together and loving what we do. Joining this team takes your career
              further and puts you next to people who will teach you something on an
              ordinary Tuesday.
            </p>
            <p>
              Ideas are argued with, not filed away. The work stretches you because
              bioprinting has no settled playbook yet, and the people around you have
              spent years writing the parts that exist.
            </p>
            <p className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)] lg:text-[1.7rem]">
              Let&rsquo;s print a brighter future together.
            </p>
          </motion.div>

          <motion.a
            {...rise(0.12)}
            href={`mailto:${COMPANY.email}?subject=Career%20opportunity%20at%20NBIL`}
            className="inline-flex w-fit items-center gap-2 justify-self-start rounded-full bg-[var(--color-brand-strong)] px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Apply now
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </motion.a>
        </div>

        {/* Why join */}
        <div className="mt-16 lg:mt-20">
          <motion.h3
            {...rise()}
            className="max-w-[24ch] font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-ink)] lg:text-[2.25rem]"
          >
            More than a job. A place to grow.
          </motion.h3>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-hairline)] md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: (i % 3) * 0.06, duration: 0.5, ease: EASE }}
                className="flex flex-col gap-3 bg-[var(--color-surface)] p-7 lg:p-8"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                  <Icon size={22} weight="duotone" className="text-[var(--color-brand-strong)]" aria-hidden="true" />
                </span>
                <h4 className="font-display text-[1.125rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  {title}
                </h4>
                <p className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Openings */}
        <motion.div
          {...rise()}
          className="mt-10 flex flex-col items-start gap-5 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10"
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Current openings
            </h3>
            <p className="max-w-[60ch] text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
              No specific roles are posted right now, but we are always keen to hear
              from people who share our passion for bioprinting. Send your resume and
              tell us how you&rsquo;d like to contribute, and we&rsquo;ll reach out when
              there&rsquo;s a fit.
            </p>
          </div>
          <a
            href={`mailto:${COMPANY.email}?subject=Open%20application%3A%20Careers%20at%20NBIL`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-brand-strong)] px-6 py-3 text-[14px] font-semibold text-[var(--color-brand-strong)] transition-colors hover:bg-[var(--color-brand-subtle)]"
          >
            Send your resume
            <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
