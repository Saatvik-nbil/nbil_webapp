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

const EASE = [0.16, 1, 0.3, 1] as const;

const BENEFITS = [
  {
    icon: GraduationCap,
    title: "Professional Development",
    body: "Our commitment to professional growth is unwavering. We offer continuous learning opportunities, workshops, and mentorship to help you achieve your career goals and stay ahead in your field.",
  },
  {
    icon: UsersThree,
    title: "Great Co-Workers",
    body: "Join a team of dedicated professionals who are not just colleagues but also friends. Our inclusive and collaborative environment fosters strong, supportive relationships with co-workers who make work enjoyable.",
  },
  {
    icon: ChartLineUp,
    title: "Career Growth Opportunities",
    body: "Explore a multitude of paths to success within our organization. We provide the tools and resources for you to reach your full potential, whether through promotions, lateral moves, or specialized training.",
  },
  {
    icon: Trophy,
    title: "Recognition and Awards",
    body: "Your hard work won't go unnoticed. We celebrate your accomplishments and dedication with a range of awards and recognition programs, acknowledging your exceptional contributions to our team.",
  },
  {
    icon: Scales,
    title: "Work-Life Balance",
    body: "We value your well-being. Enjoy a fulfilling career while having time for personal life. Our flexible hours and remote work options ensure a healthy work-life balance that suits your needs.",
  },
  {
    icon: Sparkle,
    title: "Great Company Culture",
    body: "Experience a vibrant company culture that's at the heart of our success. We prioritize a welcoming, innovative, and inclusive environment where your ideas and individuality are celebrated.",
  },
];

export default function CareersLanding() {
  const reduce = useReducedMotion();

  return (
    <main className="bg-[var(--color-bg)]">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="flex flex-col gap-5 max-w-3xl">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
            Careers
          </p>
          <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)] leading-[1.04]">
            Build your career with NBIL
          </h1>
          <p className="text-[16px] lg:text-[17px] text-[var(--color-ink-muted)] leading-relaxed">
            At Next Big Innovation Labs, we strongly believe in dreaming big,
            working hard, working together and definitely loving what we do
            because Steve Jobs once quoted, &ldquo;The only way to do great work
            is to love what you do.&rdquo;
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-6 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start border-t border-[var(--color-hairline)] pt-12 lg:pt-16">
          <div className="flex flex-col gap-6 max-w-2xl text-[15.5px] text-[var(--color-ink-muted)] leading-[1.75]">
            <p>
              Joining our team not only takes your career to the next level but
              allows you to experience the best of work, learning, and growth. We
              foster a collaborative environment where your ideas are valued. Our
              commitment to innovation pushes boundaries, allowing you to stretch
              your skills and potential. With endless opportunities for
              professional development and a supportive team, you&rsquo;ll thrive
              on a global scale. If you&rsquo;re committed to advancing technology
              and ready to work alongside visionaries who share your passion,
              apply now and be a part of something big.
            </p>
            <p className="text-[var(--color-ink)] font-medium">
              Take that one step towards the Next Big Innovation!!
            </p>
            <p className="font-display text-[1.4rem] lg:text-[1.7rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Let&rsquo;s print a brighter future together.
            </p>
          </div>
          <a
            href={`mailto:${COMPANY.email}?subject=Career%20opportunity%20at%20NBIL`}
            className="justify-self-start inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-strong)] px-6 py-3 text-[14px] font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Apply now
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      </section>

      {/* Why Join Us */}
      <section
        aria-labelledby="why-join-heading"
        className="py-20 lg:py-28 bg-[var(--color-surface-raised)] border-y border-[var(--color-hairline)]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-4 max-w-2xl mb-12 lg:mb-16">
            <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
              Why join us?
            </p>
            <h2
              id="why-join-heading"
              className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
            >
              More than a job. A place to grow.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-hairline)] border border-[var(--color-hairline)] rounded-2xl overflow-hidden">
            {BENEFITS.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: (i % 3) * 0.06,
                  duration: 0.5,
                  ease: EASE,
                }}
                className="bg-[var(--color-surface)] p-8 lg:p-10 flex flex-col gap-4"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-surface)]">
                  <Icon
                    size={22}
                    weight="duotone"
                    className="text-[var(--color-brand-strong)]"
                  />
                </span>
                <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  {title}
                </h3>
                <p className="text-[14.5px] text-[var(--color-ink-muted)] leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section
        aria-labelledby="openings-heading"
        className="max-w-7xl mx-auto px-6 py-20 lg:py-28"
      >
        <div className="flex flex-col gap-4 max-w-2xl mb-10">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-brand-strong)]">
            Openings at NBIL
          </p>
          <h2
            id="openings-heading"
            className="font-display text-[2rem] lg:text-[2.75rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] leading-[1.1]"
          >
            Current openings
          </h2>
        </div>

        <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-10 lg:p-14 flex flex-col items-start gap-5">
          <p className="text-[15.5px] text-[var(--color-ink-muted)] leading-relaxed max-w-[60ch]">
            We don&rsquo;t have any specific roles posted right now, but we are
            always keen to hear from talented people who share our passion for
            bioprinting. Send us your resume and tell us how you&rsquo;d like to
            contribute &mdash; we&rsquo;ll reach out when there&rsquo;s a fit.
          </p>
          <a
            href={`mailto:${COMPANY.email}?subject=Open%20application%20%E2%80%94%20Careers%20at%20NBIL`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-strong)] px-6 py-3 text-[14px] font-semibold text-[var(--color-brand-strong)] hover:bg-[var(--color-brand-surface)] transition-colors"
          >
            Send your resume
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      </section>
    </main>
  );
}
