"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { CheckCircle, Clock, Circle } from "lucide-react";

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  image?: string;
  status?: "completed" | "current" | "upcoming";
  category?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

// Status styling mapped to the site's blue / slate palette so it stays on-brand.
const getStatusConfig = (status: TimelineItem["status"]) => {
  const configs = {
    completed: {
      progressColor: "bg-[var(--color-brand)]",
      borderColor: "border-[var(--color-brand)]/20",
      badgeBg: "bg-[var(--color-brand-surface)]",
      badgeText: "text-[var(--color-brand-strong)]",
    },
    current: {
      progressColor: "bg-[var(--color-brand)]",
      borderColor: "border-[var(--color-brand)]/35",
      badgeBg: "bg-[var(--color-brand)]",
      badgeText: "text-white",
    },
    upcoming: {
      progressColor: "bg-[var(--color-ink-faint)]/40",
      borderColor: "border-[var(--color-hairline)]",
      badgeBg: "bg-[var(--color-surface-raised)]",
      badgeText: "text-[var(--color-ink-muted)]",
    },
  };

  return configs[status || "upcoming"];
};

const getStatusIcon = (status: TimelineItem["status"]) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "current":
      return Clock;
    default:
      return Circle;
  }
};

export function Timeline({ items, className }: TimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className={cn("w-full max-w-4xl mx-auto px-4 sm:px-6 py-8", className)}>
        <p className="text-center text-[var(--color-ink-muted)]">
          No timeline items to display
        </p>
      </div>
    );
  }

  return (
    <section
      className={cn("w-full max-w-4xl mx-auto px-4 sm:px-6 py-8", className)}
      role="list"
      aria-label="Timeline of events and milestones"
    >
      <div className="relative">
        <div
          className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-[var(--color-hairline)]"
          aria-hidden="true"
        />

        <motion.div
          className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-[var(--color-brand)] origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{
            scaleY: 1,
            transition: { duration: 1.2, ease: "easeOut", delay: 0.2 },
          }}
          viewport={{ once: true }}
          aria-hidden="true"
        />

        <div className="space-y-8 sm:space-y-12 relative">
          {items.map((item, index) => {
            const config = getStatusConfig(item.status);
            const IconComponent = getStatusIcon(item.status);

            return (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
                viewport={{ once: true, margin: "-30px" }}
                role="listitem"
                aria-label={`Timeline item ${index + 1}: ${item.title}`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[var(--color-canvas)] shadow-lg relative z-10 bg-[var(--color-surface)]">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={`${item.title}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--color-brand-surface)] flex items-center justify-center">
                            <IconComponent
                              className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-brand-strong)]"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="flex-1 min-w-0"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={cn(
                        "rounded-2xl border transition-all duration-300 hover:shadow-md relative",
                        "bg-[var(--color-surface)]/60 backdrop-blur-sm",
                        config.borderColor,
                        "group-hover:border-[var(--color-brand)]/40",
                      )}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg sm:text-xl font-semibold text-[var(--color-ink)] mb-1 group-hover:text-[var(--color-brand-strong)] transition-colors duration-300">
                              {item.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-ink-muted)]">
                              {item.category && (
                                <span className="font-medium">{item.category}</span>
                              )}
                              {item.category && item.date && (
                                <span
                                  className="w-1 h-1 bg-[var(--color-ink-faint)] rounded-full"
                                  aria-hidden="true"
                                />
                              )}
                              {item.date && <span>{item.date}</span>}
                            </div>
                          </div>

                          <Badge
                            className={cn(
                              "w-fit text-xs font-medium border-transparent",
                              config.badgeBg,
                              config.badgeText,
                            )}
                            aria-label={`Status: ${item.status || "upcoming"}`}
                          >
                            {item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)
                              : "Upcoming"}
                          </Badge>
                        </div>

                        <p className="text-sm sm:text-base text-[var(--color-ink-muted)] leading-relaxed mb-4">
                          {item.description}
                        </p>

                        <div
                          className="h-1 bg-[var(--color-surface-raised)] rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={
                            item.status === "completed"
                              ? 100
                              : item.status === "current"
                                ? 65
                                : 25
                          }
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Progress for ${item.title}`}
                        >
                          <motion.div
                            className={cn("h-full rounded-full", config.progressColor)}
                            initial={{ width: 0 }}
                            whileInView={{
                              width:
                                item.status === "completed"
                                  ? "100%"
                                  : item.status === "current"
                                    ? "65%"
                                    : "25%",
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.2,
                              delay: index * 0.15 + 0.5,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="absolute left-4 sm:left-6 -bottom-6 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              delay: items.length * 0.08 + 0.3,
              type: "spring",
              stiffness: 400,
            },
          }}
          viewport={{ once: true }}
          aria-hidden="true"
        >
          <div className="w-3 h-3 bg-[var(--color-brand)] rounded-full shadow-sm" />
        </motion.div>
      </div>
    </section>
  );
}
