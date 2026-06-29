"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

interface TeamShowcaseProps {
  members: TeamMember[];
}

export default function TeamShowcase({ members }: TeamShowcaseProps) {
  const reduce = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  // Each photo / row rises in as the section scrolls into view ("show the
  // rest of the team on scroll"). Kept off the dim element so hover opacity
  // still works after the reveal settles.
  const reveal = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { delay: i * 0.05, duration: 0.5, ease: EASE },
        };

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-14 select-none w-full max-w-6xl mx-auto py-8 px-4 md:px-6 font-sans">
      {/* ── Left: photo grid ── */}
      <div className="flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0">
        {/* Column 1 */}
        <div className="flex flex-col gap-2 md:gap-3">
          {col1.map((member, i) => (
            <motion.div key={member.id} {...reveal(i * 3)}>
              <PhotoCard
                member={member}
                className="w-[150px] h-[164px] sm:w-[182px] sm:h-[196px] md:w-[228px] md:h-[244px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            </motion.div>
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[64px] sm:mt-[78px] md:mt-[96px]">
          {col2.map((member, i) => (
            <motion.div key={member.id} {...reveal(i * 3 + 1)}>
              <PhotoCard
                member={member}
                className="w-[166px] h-[180px] sm:w-[204px] sm:h-[218px] md:w-[252px] md:h-[266px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            </motion.div>
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2 md:gap-3 mt-[30px] sm:mt-[37px] md:mt-[46px]">
          {col3.map((member, i) => (
            <motion.div key={member.id} {...reveal(i * 3 + 2)}>
              <PhotoCard
                member={member}
                className="w-[158px] h-[170px] sm:w-[190px] sm:h-[204px] md:w-[238px] md:h-[252px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right: member name list ── */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full">
        {members.map((member, i) => (
          <motion.div key={member.id} {...reveal(i)}>
            <MemberRow member={member} hoveredId={hoveredId} onHover={setHoveredId} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Photo card
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-300",
        className,
        isDimmed ? "opacity-60" : "opacity-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="(max-width: 768px) 200px, 260px"
        className="object-cover object-top transition-[filter] duration-500"
        style={{
          filter: isActive
            ? "grayscale(0) brightness(1)"
            : "grayscale(1) brightness(0.9)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Member name section
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial =
    member.social?.twitter ??
    member.social?.linkedin ??
    member.social?.instagram ??
    member.social?.behance;

  return (
    <div
      className={cn(
        "cursor-pointer transition-opacity duration-300",
        isDimmed ? "opacity-50" : "opacity-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name + social */}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "w-4 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300",
            isActive ? "bg-foreground w-5" : "bg-foreground/25",
          )}
        />
        <span
          className={cn(
            "text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300",
            isActive ? "text-foreground" : "text-foreground/80",
          )}
        >
          {member.name}
        </span>

        {/* Social icons */}
        {hasSocial && (
          <div
            className={cn(
              "flex items-center gap-1.5 ml-0.5 transition-all duration-200",
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none",
            )}
          >
            {member.social?.twitter && (
              <SocialLink href={member.social.twitter} title="X / Twitter">
                <FaTwitter size={10} />
              </SocialLink>
            )}
            {member.social?.linkedin && (
              <SocialLink href={member.social.linkedin} title="LinkedIn">
                <FaLinkedinIn size={10} />
              </SocialLink>
            )}
            {member.social?.instagram && (
              <SocialLink href={member.social.instagram} title="Instagram">
                <FaInstagram size={10} />
              </SocialLink>
            )}
            {member.social?.behance && (
              <SocialLink href={member.social.behance} title="Behance">
                <FaBehance size={10} />
              </SocialLink>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <p className="mt-1.5 pl-[27px] text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {member.role}
      </p>
    </div>
  );
}

function SocialLink({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
      title={title}
    >
      {children}
    </a>
  );
}
