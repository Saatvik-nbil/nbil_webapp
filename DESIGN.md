# Design System: Trivima NP Bioprinter

## 1. Visual Theme & Atmosphere

Precision-clinical meets premium hardware. The interface feels like stepping into a well-equipped
research lab: clean white surfaces, deliberate labeling, controlled ambient light. Zero decorative
noise. White space is structural, not filler. Asymmetric layouts communicate confidence, not
disorder. Think: high-end scientific instrument documentation crossed with Vercel-level engineering
product pages.

- **Density:** 5/10 — enough breathing room to feel premium, enough density for technical substance
- **Variance:** 7/10 — asymmetric hero, bento applications, horizontal product scroll
- **Motion:** 5/10 — intentional scroll reveals, precise hover states; not cinematic, not static

---

## 2. Color Palette & Roles

| Name | Value | Role |
|---|---|---|
| **Canvas** | `oklch(98.5% 0 0)` | Page background, near-white, zero chroma |
| **Surface** | `oklch(100% 0 0)` | Card fills, elevated containers |
| **Surface Raised** | `oklch(97% 0.006 240)` | Slightly elevated panels |
| **Charcoal Ink** | `oklch(14% 0.015 250)` | Primary text, near-black with faint blue tint |
| **Steel Muted** | `oklch(52% 0.01 250)` | Secondary text, labels, metadata |
| **Faint** | `oklch(72% 0.008 250)` | Placeholder text, captions |
| **Whisper Border** | `oklch(90% 0.008 240)` | Structural borders, card edges |
| **Border Subtle** | `oklch(95% 0.004 240)` | Section dividers, row separators |
| **Precision Teal** | `oklch(52% 0.195 210)` | Single accent: CTAs, active states, highlights |
| **Teal Hover** | `oklch(46% 0.195 210)` | Button hover state |
| **Teal Surface** | `oklch(95% 0.04 210)` | Tinted accent backgrounds |
| **Teal Subtle** | `oklch(97% 0.02 210)` | Hover tint on spec cards |
| **Dark BG** | `oklch(12% 0.018 250)` | Software section background |
| **Dark Surface** | `oklch(17% 0.016 250)` | Cards within dark sections |
| **Dark Ink** | `oklch(93% 0.008 240)` | Text on dark backgrounds |
| **Dark Muted** | `oklch(62% 0.01 240)` | Secondary text on dark backgrounds |
| **Dark Border** | `oklch(25% 0.015 250)` | Borders within dark sections |

**Accent constraint:** Single accent only. No purple, no warm brass, no neon gradients.
**Theme lock:** Full light theme. No mid-page section flips to dark except the intentional
Software section (one deliberate switch, not random alternation).

---

## 3. Typography Rules

- **Display:** `Outfit` (weights 300–700) — Geometric sans for all headings, tight tracking, controlled scale
- **Body:** `Geist Sans` — Clean, precise, 65ch max-width, muted secondary color
- **Mono:** `Geist Mono` — All technical specifications, measurements, timestamps, labels
- **Banned:** `Inter` as default, any generic serif (Times, Georgia, Garamond), `Fraunces`, `Instrument Serif`
- **Scale:**
  - Hero H1: `clamp(2.75rem, 5vw, 4rem)` — max 2 lines desktop
  - Section H2: `clamp(2rem, 4vw, 2.5rem)`
  - Feature H3: `clamp(1.625rem, 3vw, 2rem)`
  - Body: `1rem` / `0.9375rem` depending on context
  - Small labels: `0.75rem` mono uppercase, `0.18em` tracking

---

## 4. Component Stylings

- **Buttons:** Flat fill, Precision Teal background, white text. Active: `scale(0.98)` + `-1px` translate.
  No outer glows. Shadow: `0 2px 12px oklch(52% 0.195 210 / 0.22)` — tinted to accent.
- **Cards:** `1rem` radius (16px) consistently across ALL components. 1px Whisper Border.
  Used selectively: product cards, spec cards, contact form. Key Metrics section uses NO card boxes.
- **Inputs:** Label above, placeholder in faint color, error below. Accent focus ring (2px, 20% opacity).
  Standard `rounded-xl` (same radius system as cards).
- **Spec tiles:** `rounded-xl`, Canvas background, Whisper Border. Hover: border shifts to Teal,
  background shifts to Teal Subtle.
- **Loaders:** Shimmer skeleton matching layout dimensions. No circular spinners.

**Shape consistency:** One radius system site-wide. `rounded-xl` (12px) for form elements and
spec tiles; `rounded-2xl` (16px) for image containers and feature cards. Never mixed arbitrarily.

---

## 5. Layout Principles

- **Grid-first:** CSS Grid for all 2D layouts, Flexbox for 1D alignment only
- **Max-width:** `max-w-7xl` (1280px) centered with `px-6` gutters
- **Hero:** Asymmetric `lg:grid-cols-12` split (7 + 5 columns). Centered hero is BANNED.
- **Applications:** Bento grid, exactly 5 cells (2+3 split), visual variety enforced across cells
- **Technology:** 2 zig-zag sections maximum. Third consecutive image+text split is pre-flight fail.
- **Specifications:** 2-column card grid per spec group. Spec table with hairline per row is BANNED.
- **Product line:** Horizontal scroll carousel. Single marquee maximum.
- **Mobile:** All multi-column layouts collapse to single column at `< 768px` (no exceptions)
- **Viewport height:** `min-h-[100dvh]` only (never `h-screen`, iOS Safari jump bug)
- **Section spacing:** `py-20 lg:py-28` (vertical rhythm consistent site-wide)

---

## 6. Motion & Interaction

- **Engine:** Motion (`motion/react`) — import from `motion/react`
- **Spring physics:** `stiffness: 100, damping: 20` for interactive elements. No linear easing.
- **Easing for reveals:** `[0.16, 1, 0.3, 1]` (expo out) — premium, weighty
- **Hero stagger:** 0.07s delay per element (0 through 4 elements)
- **Scroll reveals:** `whileInView` with `once: true`, `amount: 0.25-0.4`
- **Hover:** Cards `scale(1.02)` or border color change; CTAs `-1px translate` on active
- **No perpetual loops** except where semantically meaningful (status indicators)
- **Motivated only:** Every animation serves hierarchy, storytelling, feedback, or state transition
- **Reduced motion:** `useReducedMotion()` wrapped on ALL animated components. Every `motion.*`
  gets `initial={reduce ? false : ...}`. CSS animations wrapped in `prefers-reduced-motion: reduce`.

---

## 7. Anti-Patterns (Banned)

- No `Inter` as default font
- No AI purple/blue neon palette or gradients
- No centered hero section (variance > 4)
- No 3-equal-card feature grids
- No warm beige/brass/cream backgrounds (banned family)
- No em dashes (`—` or `–`) anywhere on the page
- No eyebrow above every section (max 3 across 9 sections)
- No spec table with `border-b` on every row
- No scroll cues or bouncing chevrons
- No version labels in hero (V0.6, BETA, etc.)
- No section-numbering eyebrows (00 / 01 / 02)
- No decorative status dots
- No pills/labels overlaid on images
- No generic placeholder names (John Doe, Acme, Nexus)
- No AI copywriting clichés (Seamless, Unleash, Elevate, Next-Gen)
- No pure black (`#000000`) or pure white body text on colored backgrounds without contrast check
- No `h-screen` (use `min-h-[100dvh]`)
- No `window.addEventListener('scroll')` — use Motion `useScroll()` or passive listener

---

## 8. SEO + AI Search Architecture

### Technical SEO
- `<title>` and `<meta description>` in `layout.tsx` via Next.js `Metadata` API
- Canonical URL pointing to the product page
- `robots` with `googleBot` max-image-preview: large
- `viewport` with theme-color for both light/dark
- `<html lang="en">` set at root

### Semantic HTML
- Landmark roles: `<header role="banner">`, `<main>`, `<footer role="contentinfo">`
- Section headings form a proper `h1 → h2 → h3` hierarchy with no skips
- `<address>` for company contact information
- `<dl>` / `<dt>` / `<dd>` for FAQ accordion (definition list semantics)
- `<nav aria-label>` on all navigation elements
- `aria-label` or `aria-labelledby` on every `<section>`

### Structured Data (JSON-LD)
Two schemas injected as `<script type="application/ld+json">`:

1. **`Product` schema** — complete with:
   - `name`, `description`, `alternateName`
   - `brand`, `manufacturer` (with address + contactPoint)
   - `additionalProperty` array for all 13 technical specs
   - `offers` with `availability`, `seller`, `areaServed`

2. **`FAQPage` schema** — 7 Q&A pairs covering:
   - Product differentiation (non-planar vs flat-bed)
   - Material compatibility
   - Build volume and customization
   - UV wavelengths
   - Software (Dhee)
   - Biosafety cabinet compatibility
   - Manufacturing location

### AI Search Optimization
- Each FAQ answer is written in complete, standalone sentences (no pronoun-only references)
- Specifications are stated in natural language AND structured data
- Company name, location, and contact details appear in visible body copy AND structured data
- Product comparisons (Trivima range) give AI models context to answer "which Trivima model for X"
- No content gated behind JS-only rendering (all critical content in server components)
- `<Image>` components with descriptive `alt` text for visual content indexing
