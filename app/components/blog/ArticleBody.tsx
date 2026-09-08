import Link from "next/link";

import type { Block, Inline, ListItem } from "@/lib/markdown";

/**
 * Renders a parsed article body with the site's own type scale.
 *
 * Headings keep the level the author wrote, so an H2 in the source is an H2
 * here and the document outline matches the original article.
 */

function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        if (n.type === "strong")
          return (
            <strong key={i} className="font-semibold text-[var(--color-ink)]">
              {n.value}
            </strong>
          );
        if (n.type === "em") return <em key={i}>{n.value}</em>;
        if (n.type === "link") {
          const external = /^https?:\/\//.test(n.href);
          const className =
            "font-medium text-[var(--color-brand-strong)] underline decoration-[var(--color-brand)]/30 underline-offset-2 transition-colors hover:decoration-[var(--color-brand)]";
          return external ? (
            <a
              key={i}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {n.value}
            </a>
          ) : (
            <Link key={i} href={n.href} className={className}>
              {n.value}
            </Link>
          );
        }
        return <span key={i}>{n.value}</span>;
      })}
    </>
  );
}

function Items({ items, ordered }: { items: ListItem[]; ordered: boolean }) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      className={
        ordered
          ? "flex list-decimal flex-col gap-4 pl-6 marker:font-semibold marker:text-[var(--color-brand-strong)]"
          : "flex list-disc flex-col gap-3 pl-6 marker:text-[var(--color-brand)]"
      }
    >
      {items.map((item, i) => (
        <li key={i} className="text-[16px] leading-[1.8] text-[var(--color-ink-muted)]">
          <Inlines nodes={item.content} />
          {item.children.length > 0 && (
            <div className="mt-3">
              <Items items={item.children} ordered={false} />
            </div>
          )}
        </li>
      ))}
    </ListTag>
  );
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => {
        if (b.type === "heading") {
          if (b.level === 1 || b.level === 2) {
            return (
              <h2
                key={i}
                className="mt-6 font-display text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--color-ink)] lg:text-[1.85rem]"
              >
                <Inlines nodes={b.content} />
              </h2>
            );
          }
          if (b.level === 3) {
            return (
              <h3
                key={i}
                className="mt-4 font-display text-[1.2rem] font-semibold leading-[1.25] tracking-[-0.015em] text-[var(--color-ink)] lg:text-[1.35rem]"
              >
                <Inlines nodes={b.content} />
              </h3>
            );
          }
          return (
            <h4
              key={i}
              className="mt-2 font-display text-[1.05rem] font-semibold leading-[1.3] text-[var(--color-ink)]"
            >
              <Inlines nodes={b.content} />
            </h4>
          );
        }

        if (b.type === "list") {
          return <Items key={i} items={b.items} ordered={b.ordered} />;
        }

        return (
          <p key={i} className="text-[16px] leading-[1.8] text-[var(--color-ink-muted)]">
            <Inlines nodes={b.content} />
          </p>
        );
      })}
    </div>
  );
}
