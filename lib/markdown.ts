/**
 * A small markdown parser for the blog bodies in `content/blog/`.
 *
 * These files are hand-transcribed articles, not arbitrary user input, so this
 * covers exactly what they use rather than the whole CommonMark surface:
 * ATX headings, paragraphs, ordered and unordered lists (one level of nesting),
 * and inline bold, italic and links. Anything else passes through as text.
 *
 * It returns a block tree rather than an HTML string so the renderer can style
 * each element with the site's own type scale, and so nothing is ever piped
 * through `dangerouslySetInnerHTML`.
 */

export type Inline =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "link"; value: string; href: string };

export type ListItem = { content: Inline[]; children: ListItem[] };

export type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4; content: Inline[] }
  | { type: "paragraph"; content: Inline[] }
  | { type: "list"; ordered: boolean; items: ListItem[] };

/** Splits a line into text, bold, italic and link runs. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  // Order matters: links first, then bold, then italic, so `**a**` is not
  // mistaken for two italic markers.
  const pattern =
    /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(?<!\*)\*([^*]+)\*(?!\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      out.push({ type: "text", value: text.slice(last, m.index) });
    }
    if (m[1] !== undefined) {
      out.push({ type: "link", value: m[1], href: m[2] });
    } else if (m[3] !== undefined) {
      out.push({ type: "strong", value: m[3] });
    } else if (m[4] !== undefined) {
      out.push({ type: "em", value: m[4] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}

const ORDERED = /^(\s*)(\d+)\.\s+(.*)$/;
const UNORDERED = /^(\s*)[-*]\s+(.*)$/;

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({
      type: "paragraph",
      content: parseInline(paragraph.join(" ").trim()),
    });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      const level = Math.min(heading[1].length, 4) as 1 | 2 | 3 | 4;
      blocks.push({ type: "heading", level, content: parseInline(heading[2]) });
      continue;
    }

    if (ORDERED.test(line) || UNORDERED.test(line)) {
      flushParagraph();
      const ordered = ORDERED.test(line);
      const items: ListItem[] = [];

      // Consume the run of list lines. An indented line becomes a child of the
      // item above it, which is the only nesting these articles use.
      while (i < lines.length) {
        const cur = lines[i];
        if (!cur.trim()) {
          // A blank line ends the list only if the next line is not a list item.
          const next = lines[i + 1] ?? "";
          if (!ORDERED.test(next) && !UNORDERED.test(next)) break;
          i++;
          continue;
        }
        const om = ORDERED.exec(cur);
        const um = UNORDERED.exec(cur);
        if (!om && !um) break;

        const indent = (om ? om[1] : um![1]).length;
        const text = om ? om[3] : um![2];
        const item: ListItem = { content: parseInline(text), children: [] };

        if (indent >= 2 && items.length) {
          items[items.length - 1].children.push(item);
        } else {
          items.push(item);
        }
        i++;
      }
      i--;
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  return blocks;
}

/** Strips the leading H1 so the page can render it as its own title. */
export function splitTitle(src: string): { title: string; body: string } {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const first = lines.findIndex((l) => l.trim());
  const m = first >= 0 ? /^#\s+(.*)$/.exec(lines[first].trim()) : null;
  if (!m) return { title: "", body: src };
  return { title: m[1], body: lines.slice(first + 1).join("\n") };
}
