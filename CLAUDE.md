# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/product site for **Next Big Innovation Labs (NBIL)** and its **Trivima** bioprinter range. The app package is `trivima-landing`. The repo root is `trivimaweb/`; the actual Next.js app lives in `nbil_webapp/` — run all commands from there.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint
```

There are no tests. All npm scripts wrap Next with `cross-env NODE_OPTIONS=--no-experimental-webstorage` — invoke Next through these scripts, not `next` directly, or the flag is lost.

There is no standalone ESLint config — `next lint` uses Next's built-in ruleset. Don't add an `.eslintrc` expecting one to already exist.

`scripts/extract-frames.mjs` uses ffmpeg to turn a video clip into a numbered image sequence for scroll-scrub animations (e.g. `public/images/np-seq/`): `node scripts/extract-frames.mjs <clip> [fps] [width]`.

## Stack

- **Next.js App Router**, **React**, **TypeScript** (strict), **Tailwind CSS v4** (versions in `package.json`).
- Path alias `@/*` → project root (so `@/lib/...`, `@/components/...`, `@/app/...`).
- Deployment target is **Render** (see git history).

## Architecture

**Data is centralized in `lib/machines.ts`.** This is the single source of truth for the entire product catalog: the `Machine[]` array (Trivima Pro / NP / Aura with full specs, stats, features, applications) plus the `COMPANY` constant (name, email, phone, address). Pages and components import from here rather than hardcoding — when product facts or contact details change, edit this file. `getMachine(slug)` looks up a single model.

**Routing** is the App Router under `app/`. Top-level routes each have a `page.tsx` (`/`, `/trivima`, `/consultancy`, `/team`, `/careers`, `/news`, `/blogs`, `/guides`, `/newsletter`, `/privacy-policy`). The company story is a section on the home page (`StoryTimeline`, anchor `/#story`), not a standalone route. Product detail is the dynamic route `app/machines/[slug]/page.tsx`, which is statically generated via `generateStaticParams()` from the `machines` array and builds per-model metadata + JSON-LD in `generateMetadata`.

**Forms all share one pipeline.** Every lead-capture form posts to `/api/forms`, which validates the payload and forwards it to a Google Apps Script web app that appends a row to a Google Sheet and emails a notification. `lib/forms.ts` is the registry — add a `FormId` and a `FORMS` entry there, then build the component with `useFormSubmit()` and the primitives in `app/components/forms/fields.tsx`; no server or Apps Script change is needed. Field labels become sheet column headers, so treat them as stable. Requires `GOOGLE_SCRIPT_URL` (see `.env.example`). Full setup steps: `docs/FORMS.md`. HubSpot has been removed — don't reintroduce an embed.

**Component layers:**

- `components/ui/` — shadcn/ui primitives + vendored visual-effect components (liquid-glass, coordinate-cursor, timelines, etc.). shadcn is configured for the `radix-nova` style with the `lucide` icon library (`components.json`).
- `app/components/` — page-specific sections, grouped by area (`company/`, `catalog/`, `consultancy/`, `machine/`, `blog/`, `careers/`, `news/`, `team/`) plus shared chrome (`NavBar`, `Footer`, `ContactSection`, `SmoothScroll`, `ScrollProgress`).
- Pages compose these sections top-to-bottom (see `app/page.tsx`); most of the visual work is in the section components.

**Global providers live in `app/layout.tsx`** and wrap every page: `SmoothScroll` (Lenis + GSAP), `ScrollProgress`, `CoordinateCursor`, and the SVG filter defs for the liquid-glass surfaces. Fonts (Libre Franklin, Geist Mono) and the site-wide `Metadata`/`viewport` are also defined here. (There used to be an `IntroGate` intro-loader gate with a three.js/anime.js "exploding cube" animation — removed by request; `three` and `animejs` are no longer dependencies.)

**SEO is a first-class concern.** Every page sets `Metadata` (title/description/canonical/OpenGraph) via the Next Metadata API, and key pages inject JSON-LD structured data as `<script type="application/ld+json">` (Organization on the home page, per-model `Product` schema on machine pages). Keep visible copy and structured data in sync when editing product facts.

## Motion & scroll

Motion is layered and intentional — several libraries coexist by role:

- **Lenis** smooth-scroll + **GSAP ScrollTrigger** are wired together in `app/components/SmoothScroll.tsx` (Lenis drives GSAP's ticker so ScrollTriggers stay in sync). Lenis is exposed as `window.lenis` for anchor scrolling.
- **Motion** (`motion/react`) for component reveals/hover, **anime.js** and **three.js** for specific effects.

**All motion must respect `prefers-reduced-motion`** — `SmoothScroll` disables itself entirely under reduced motion, and animated components are expected to guard with `useReducedMotion()`.

## Styling & design system

Tailwind v4 is **CSS-first**: there is no `tailwind.config.*`. Design tokens are declared as CSS custom properties in the `@theme` block of `app/globals.css` (`--color-brand`, `--color-ink`, `--color-canvas`, dark-surface tokens, fonts). Reference them as `var(--color-...)` / Tailwind `bg-[var(--color-brand)]`. To change the palette or type, edit `globals.css`.

Current live design: **electric-blue accent `#2572FD`** on a cool-slate neutral scale, **Libre Franklin** as the display + body face with **Geist Mono** reserved for technical spec data.

> **Note:** `DESIGN.md` documents an earlier design direction (Outfit / Geist Sans fonts, a "Precision Teal" accent) that does **not** match the shipped implementation. Treat `globals.css` as the source of truth for tokens; `DESIGN.md` is still useful for its layout principles, motion values, and anti-patterns (banned centered heroes, em dashes, 3-equal-card grids, AI clichés, `h-screen`, etc.).

## Gotchas

- **Webpack filesystem cache is disabled** in `next.config.ts` (`config.cache = false`) because this machine's disk fills and the pack cache overflows with ENOSPC. Rebuilds are slower but won't crash — don't "fix" this by re-enabling the cache.
- **Phosphor icons in server components** must import from `@phosphor-icons/react/dist/ssr` (see `app/machines/[slug]/page.tsx`); the default entry is client-only.
- Remote images are restricted to `picsum.photos` and `images.unsplash.com` in `next.config.ts` — add hostnames there before using `next/image` with a new source.
