# Graph Report - nbil_webapp  (2026-06-22)

## Corpus Check
- 42 files · ~218,242 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 224 nodes · 295 edges · 19 communities (13 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38d0dfc7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `compilerOptions` - 16 edges
3. `Design System: Trivima NP Bioprinter` - 9 edges
4. `Button()` - 7 edges
5. `tailwind` - 6 edges
6. `aliases` - 6 edges
7. `machines` - 6 edges
8. `scripts` - 5 edges
9. `8. SEO + AI Search Architecture` - 5 edges
10. `getMachine()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `LiquidButton()` --calls--> `cn()`  [EXTRACTED]
  components/ui/liquid-glass-button.tsx → lib/utils.ts
- `TestimonialCard()` --calls--> `cn()`  [EXTRACTED]
  components/ui/stagger-testimonials.tsx → lib/utils.ts
- `Accordion()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts
- `AccordionTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/ui/accordion.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (19 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (26): itemListSchema, orgSchema, ORDER, Row, ROWS, EASE, FeatureCard(), MachineCard() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (19): CONTACTS, cn(), Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), Badge(), badgeVariants (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (6): TestimonialsSection(), SQRT_5000, StaggerTestimonials(), TestimonialCard(), TestimonialCardProps, testimonials

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (15): devDependencies, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, typescript, name (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): dependencies, class-variance-authority, clsx, geist, gsap, lenis, lucide-react, motion (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (13): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Motion & Interaction, 7. Anti-Patterns (Banned), 8. SEO + AI Search Architecture (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (5): libreFranklin, metadata, viewport, ScrollProgress(), SmoothScroll()

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (6): EASE, Button(), buttonVariants, Spline, SplineScene(), SplineSceneProps

### Community 16 - "Community 16"
Cohesion: 0.16
Nodes (9): NAV_LINKS, LiquidButton(), LiquidButtonProps, LiquidButtonSize, LiquidButtonVariant, LiquidGlassFilter(), LiquidLink(), LiquidLinkProps (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (3): CAPABILITIES, EASE, SUITES

## Knowledge Gaps
- **117 isolated node(s):** `CONTACTS`, `RESOURCE_LINKS`, `COMPANY_LINKS`, `NAV_LINKS`, `EASE` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 16`, `Community 9`, `Community 2`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 9` to `Community 16`, `Community 1`, `Community 0`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 6` to `Community 5`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `CONTACTS`, `RESOURCE_LINKS`, `COMPANY_LINKS` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07781649245063879 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._