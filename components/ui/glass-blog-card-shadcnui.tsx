"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { BookOpen, Clock } from "lucide-react";

interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  href?: string;
  external?: boolean;
  author?: {
    name: string;
    avatar?: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  ctaLabel?: string;
  className?: string;
}

const defaultPost = {
  title: "The Future of UI Design",
  excerpt:
    "Exploring the latest trends in glassmorphism, 3D elements, and micro-interactions.",
  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  date: "Dec 2, 2025",
  tags: ["Design", "UI/UX"],
};

export function GlassBlogCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  image = defaultPost.image,
  href,
  external = false,
  author,
  date = defaultPost.date,
  readTime,
  tags = defaultPost.tags,
  ctaLabel = "Read Article",
  className,
}: GlassBlogCardProps) {
  const externalAttrs = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("w-full", className)}
    >
      <a
        href={href ?? "#"}
        {...externalAttrs}
        aria-label={title}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)]/70 backdrop-blur-md shadow-[0_10px_30px_rgba(2,12,27,0.06)] transition-all duration-300 hover:border-[var(--color-brand)]/60 hover:shadow-[0_18px_50px_rgba(45,129,228,0.14)]"
      >
        {/* Image Section */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 to-transparent opacity-55 transition-opacity duration-300 group-hover:opacity-40" />

          {tags && tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[var(--color-surface)]/80 text-[var(--color-ink)] backdrop-blur-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Hover Overlay Action */}
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink)]/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--color-brand)]/25 transition-transform duration-200 group-hover:scale-[1.04]">
              <BookOpen className="h-4 w-4" />
              {ctaLabel}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold leading-tight tracking-[-0.01em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-brand-strong)] line-clamp-2">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-[var(--color-ink-muted)]">
              {excerpt}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--color-hairline-subtle)] pt-4">
            <div className="flex items-center gap-2">
              {author && (
                <Avatar className="size-8 border border-[var(--color-hairline)]">
                  {author.avatar && (
                    <AvatarImage src={author.avatar} alt={author.name} />
                  )}
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col text-xs">
                {author && (
                  <span className="font-medium text-[var(--color-ink)]">
                    {author.name}
                  </span>
                )}
                <span className="text-[var(--color-ink-faint)]">{date}</span>
              </div>
            </div>

            {readTime && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-ink-faint)]">
                <Clock className="h-3 w-3" />
                <span>{readTime}</span>
              </div>
            )}
          </div>
        </div>
      </a>
    </motion.article>
  );
}
