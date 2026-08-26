// Schematic diagrams for the machine-page "Applications" photo well.
//
// Real photography lands per-application over time (see the `image` field on
// `Application` in lib/machines.ts). Until then, a card falls back here
// instead of the bare "image coming soon" glyph. Each diagram is a small,
// technically accurate line drawing of the structure the application text
// describes — a vessel cross-section, a branching airway, a stent lattice —
// rendered in the brand line-art style and given one purposeful animation
// (flow, breathing, a pulse) rather than a decorative flourish. Pure CSS
// animation (keyframes in app/globals.css under "Application diagram
// icons"), so this stays a plain server-renderable component.

const STROKE = "var(--color-brand-strong)";
const STROKE_SOFT = "var(--color-brand)";
const FILL_TINT = "var(--color-brand-surface)";
const FILL_SOLID = "var(--color-brand)";
const NEUTRAL = "var(--color-ink-faint)";
const VOID = "var(--color-surface)";

const VIEWBOX = "0 0 120 75";

/** Faint corner registration marks — a shared motif that ties the 12
    diagrams together as one "technical schematic" family. */
function CornerMarks() {
  return (
    <g stroke={NEUTRAL} strokeWidth={1} opacity={0.25} strokeLinecap="round" fill="none">
      <path d="M6,12 V6 H12" />
      <path d="M108,6 H114 V12" />
      <path d="M114,63 V69 H108" />
      <path d="M12,69 H6 V63" />
    </g>
  );
}

function Diagram({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={VIEWBOX}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <CornerMarks />
      {children}
    </svg>
  );
}

/** Vascular tissue engineering — concentric-wall cross-section beside a
    perfusable longitudinal graft, flow animated along the lumen. */
function VascularIcon() {
  return (
    <Diagram>
      <circle cx={27} cy={37.5} r={19} fill="none" stroke={NEUTRAL} strokeWidth={1} opacity={0.4} />
      <circle cx={27} cy={37.5} r={13} fill={FILL_TINT} fillOpacity={0.55} stroke={STROKE_SOFT} strokeWidth={1.2} opacity={0.8} />
      <circle cx={27} cy={37.5} r={6} fill={VOID} stroke={STROKE} strokeWidth={1.5} />
      <rect x={56} y={22} width={52} height={31} rx={15.5} fill="none" stroke={STROKE} strokeWidth={1.6} />
      <rect x={56} y={30} width={52} height={15} rx={7.5} fill={FILL_TINT} fillOpacity={0.5} stroke={STROKE_SOFT} strokeWidth={1} opacity={0.7} />
      <path d="M63,37.5 H101" fill="none" stroke={STROKE} strokeWidth={1.6} strokeLinecap="round" className="app-icon-flow" />
    </Diagram>
  );
}

/** Respiratory & airway models — trachea with cartilage-ring ticks
    branching into two bronchi, uniform lumens, gently breathing. */
function AirwayIcon() {
  const rings = [11, 16, 21, 26, 31];
  return (
    <Diagram>
      <g className="app-icon-breathe app-icon-anim">
        <rect x={54} y={6} width={12} height={30} rx={6} fill={FILL_TINT} fillOpacity={0.4} stroke={STROKE} strokeWidth={1.5} />
        {rings.map((y) => (
          <line key={y} x1={55} y1={y} x2={65} y2={y} stroke={NEUTRAL} strokeWidth={1} opacity={0.5} />
        ))}
        <rect x={56} y={34} width={8} height={34} rx={4} transform="rotate(43 60 34)" fill={FILL_TINT} fillOpacity={0.4} stroke={STROKE} strokeWidth={1.5} />
        <rect x={56} y={34} width={8} height={34} rx={4} transform="rotate(-43 60 34)" fill={FILL_TINT} fillOpacity={0.4} stroke={STROKE} strokeWidth={1.5} />
      </g>
    </Diagram>
  );
}

/** Cardiovascular stents & implants — a tubular graft with a diamond
    stent lattice, expanding and settling on loop. */
function StentIcon() {
  return (
    <Diagram>
      <g className="app-icon-expand app-icon-anim">
        <rect x={18} y={20} width={84} height={35} rx={17.5} fill={FILL_TINT} fillOpacity={0.35} stroke={STROKE} strokeWidth={1.6} />
        <path
          d="M24,27 L33.7,48 L43.4,27 L53.1,48 L62.8,27 L72.5,48 L82.2,27 L91.9,48"
          fill="none"
          stroke={STROKE}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <path
          d="M28.85,48 L38.55,27 L48.25,48 L57.95,27 L67.65,48 L77.35,27 L87.05,48"
          fill="none"
          stroke={STROKE_SOFT}
          strokeWidth={1.2}
          strokeLinejoin="round"
          opacity={0.85}
        />
      </g>
    </Diagram>
  );
}

/** Organoid & disease modeling — a multiwell array of uniform organoids,
    a pulse sweeping across the plate. */
function OrganoidArrayIcon() {
  const cols = [27, 50, 73, 96];
  const rows = [27, 50];
  let i = 0;
  return (
    <Diagram>
      {rows.map((y) =>
        cols.map((x) => {
          const delay = (i++ % cols.length) * 0.18;
          return (
            <g key={`${x}-${y}`}>
              <rect x={x - 9} y={y - 9} width={18} height={18} rx={4} fill="none" stroke={NEUTRAL} strokeWidth={1} opacity={0.4} />
              <circle
                cx={x}
                cy={y}
                r={5}
                fill={FILL_SOLID}
                className="app-icon-pulse app-icon-anim"
                style={{ animationDelay: `${delay}s` }}
              />
            </g>
          );
        }),
      )}
    </Diagram>
  );
}

/** Ocular & corneal constructs — a thin lens shell curved over the
    globe, a soft glint sweeping across the hydrogel surface. */
function CornealIcon() {
  return (
    <Diagram>
      <circle cx={60} cy={44} r={20} fill="var(--color-surface-raised)" stroke={NEUTRAL} strokeWidth={1.2} opacity={0.5} />
      {/* Thin lens shell floating just outside the globe surface — a real
          gap between the two radii, so it reads as an applied cap rather
          than a second concentric ring. */}
      <path
        d="M35.57,35.11 A26,26 0 0 1 84.43,35.11 L81.61,36.13 A23,23 0 0 0 38.39,36.13 Z"
        fill={FILL_TINT}
        fillOpacity={0.75}
        stroke={STROKE}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <ellipse cx={50} cy={24} rx={3} ry={1.1} fill="#ffffff" className="app-icon-sweep app-icon-anim" />
    </Diagram>
  );
}

/** Organoid & spheroid printing — a nozzle depositing droplets that
    build into layered spheroids. */
function OrganoidPrintIcon() {
  return (
    <Diagram>
      <path d="M54,8 L66,8 L60,18 Z" fill={STROKE} />
      <line x1={60} y1={18} x2={60} y2={34} stroke={STROKE_SOFT} strokeWidth={1.4} strokeDasharray="3 3" opacity={0.6} className="app-icon-flow" />
      <circle cx={60} cy={23} r={3} fill={FILL_SOLID} className="app-icon-drop app-icon-anim" />
      <circle cx={60} cy={54} r={14} fill="none" stroke={NEUTRAL} strokeWidth={1} opacity={0.4} />
      <circle cx={60} cy={54} r={9} fill={FILL_TINT} fillOpacity={0.6} stroke={STROKE_SOFT} strokeWidth={1} opacity={0.8} />
      <circle cx={60} cy={54} r={4} fill={FILL_SOLID} />
      <circle cx={36} cy={58} r={7} fill={FILL_TINT} fillOpacity={0.6} stroke={STROKE} strokeWidth={1.2} />
      <circle cx={36} cy={58} r={2.4} fill={FILL_SOLID} />
      <circle cx={84} cy={58} r={7} fill={FILL_TINT} fillOpacity={0.6} stroke={STROKE} strokeWidth={1.2} />
      <circle cx={84} cy={58} r={2.4} fill={FILL_SOLID} />
    </Diagram>
  );
}

/** Multi-material scaffolds — a woodpile lattice of graded struts,
    the two material passes breathing in alternation. */
function ScaffoldIcon() {
  const horizontals = [
    { y: 20, w: 2 },
    { y: 29, w: 2.6 },
    { y: 38, w: 3.2 },
    { y: 47, w: 3.8 },
  ];
  const verticals = [26, 42, 58, 74, 90];
  return (
    <Diagram>
      <g className="app-icon-fade app-icon-anim">
        {horizontals.map(({ y, w }) => (
          <line key={y} x1={18} y1={y} x2={102} y2={y} stroke={STROKE} strokeWidth={w} strokeLinecap="round" opacity={0.85} />
        ))}
      </g>
      <g className="app-icon-fade app-icon-anim" style={{ animationDelay: "1.5s" }}>
        {verticals.map((x) => (
          <line key={x} x1={x} y1={14} x2={x} y2={53} stroke={NEUTRAL} strokeWidth={2.2} strokeLinecap="round" opacity={0.55} />
        ))}
      </g>
    </Diagram>
  );
}

/** Complex tissue engineering — three distinct cell morphologies (round,
    spindle, stellate) sharing one construct, pulsing on staggered beats. */
function ComplexTissueIcon() {
  return (
    <Diagram>
      <rect x={16} y={14} width={88} height={48} rx={10} fill="var(--color-surface-raised)" stroke={NEUTRAL} strokeWidth={1} opacity={0.4} />
      <g className="app-icon-pulse app-icon-anim">
        <circle cx={34} cy={28} r={4} fill={FILL_SOLID} />
        <circle cx={70} cy={44} r={4} fill={FILL_SOLID} />
        <circle cx={50} cy={52} r={4} fill={FILL_SOLID} />
      </g>
      <g className="app-icon-pulse app-icon-anim" style={{ animationDelay: "0.6s" }}>
        <ellipse cx={60} cy={24} rx={7} ry={2.4} transform="rotate(-20 60 24)" fill="none" stroke={STROKE} strokeWidth={1.6} />
        <ellipse cx={86} cy={36} rx={7} ry={2.4} transform="rotate(15 86 36)" fill="none" stroke={STROKE} strokeWidth={1.6} />
        <ellipse cx={30} cy={50} rx={7} ry={2.4} transform="rotate(30 30 50)" fill="none" stroke={STROKE} strokeWidth={1.6} />
      </g>
      <g className="app-icon-pulse app-icon-anim" style={{ animationDelay: "1.2s" }} stroke={STROKE_SOFT} strokeWidth={1.4} strokeLinecap="round">
        <path d="M46,17 L46,23 M43,20 L49,20" />
        <path d="M80,51 L80,57 M77,54 L83,54" />
        <path d="M20,35 L20,41 M17,38 L23,38" />
      </g>
    </Diagram>
  );
}

/** Research-driven applications — a hub radiating into the surrounding
    fields it serves, the signal travelling outward on a loop. */
function ResearchNetworkIcon() {
  const angles = [-90, -18, 54, 126, 198];
  const cx = 60;
  const cy = 37.5;
  const rx = 27;
  const ry = 16;
  const nodes = angles.map((a) => {
    const rad = (Math.PI / 180) * a;
    return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) };
  });
  return (
    <Diagram>
      {nodes.map((n, i) => (
        <line key={i} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={NEUTRAL} strokeWidth={1} opacity={0.4} />
      ))}
      <circle cx={cx} cy={cy} r={6} fill={FILL_SOLID} className="app-icon-pulse app-icon-anim" />
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={4}
          fill={FILL_TINT}
          stroke={STROKE}
          strokeWidth={1.2}
          className="app-icon-pulse app-icon-anim"
          style={{ animationDelay: `${0.3 + i * 0.22}s` }}
        />
      ))}
    </Diagram>
  );
}

/** Tissue engineering & regenerative medicine — a cell-laden hydrogel
    block with a physiologic branching mesh, cells pulsing asynchronously. */
function HydrogelIcon() {
  const cells: [number, number][] = [
    [34, 26], [50, 22], [66, 30], [82, 24], [30, 42],
    [48, 46], [64, 42], [80, 46], [58, 54],
  ];
  return (
    <Diagram>
      <rect x={20} y={16} width={80} height={44} rx={20} fill={FILL_TINT} fillOpacity={0.5} stroke={STROKE} strokeWidth={1.6} />
      <path d="M30,50 C40,40 36,28 46,20 M74,20 C84,28 80,40 90,50" fill="none" stroke={NEUTRAL} strokeWidth={1} opacity={0.4} />
      {cells.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={2.2}
          fill={FILL_SOLID}
          className="app-icon-pulse app-icon-anim"
          style={{ animationDelay: `${(i % 5) * 0.35}s` }}
        />
      ))}
    </Diagram>
  );
}

/** Organ-on-chip & microphysiological systems — two tissue chambers
    joined by a winding microfluidic channel, fluid flowing between. */
function OrganOnChipIcon() {
  return (
    <Diagram>
      <rect x={14} y={14} width={92} height={47} rx={6} fill="var(--color-surface-raised)" stroke={STROKE} strokeWidth={1.6} />
      <line x1={8} y1={37.5} x2={14} y2={37.5} stroke={STROKE} strokeWidth={1.6} />
      <line x1={106} y1={37.5} x2={112} y2={37.5} stroke={STROKE} strokeWidth={1.6} />
      <ellipse cx={38} cy={37.5} rx={12} ry={9} fill={FILL_TINT} fillOpacity={0.6} stroke={STROKE} strokeWidth={1.4} />
      <ellipse cx={82} cy={37.5} rx={12} ry={9} fill={FILL_TINT} fillOpacity={0.6} stroke={STROKE} strokeWidth={1.4} />
      <path
        d="M50,37.5 C58,25 66,50 74,37.5"
        fill="none"
        stroke={STROKE_SOFT}
        strokeWidth={1.6}
        strokeDasharray="3 4"
        className="app-icon-flow"
      />
    </Diagram>
  );
}

function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(" L")} Z`;
}

/** Bioinspired materials & soft-matter physics — a honeycomb lattice
    graded from small to large cells, swaying like a soft structure. */
function LatticeIcon() {
  const hexes = [
    { cx: 20, r: 7 },
    { cx: 39, r: 8.4 },
    { cx: 60, r: 10 },
    { cx: 83, r: 11.6 },
    { cx: 108, r: 13.2 },
  ];
  return (
    <Diagram>
      <g className="app-icon-sway app-icon-anim">
        {hexes.map((h, i) => (
          <path
            key={i}
            d={hexPath(h.cx, 39, h.r)}
            fill={i % 2 === 0 ? FILL_TINT : "none"}
            fillOpacity={0.5}
            stroke={STROKE}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </Diagram>
  );
}

const DIAGRAMS: Record<string, () => React.ReactElement> = {
  "Vascular tissue engineering": VascularIcon,
  "Respiratory & airway models": AirwayIcon,
  "Cardiovascular stents & implants": StentIcon,
  "Organoid & disease modeling": OrganoidArrayIcon,
  "Ocular & corneal constructs": CornealIcon,
  "Organoid & spheroid printing": OrganoidPrintIcon,
  "Multi-material scaffolds": ScaffoldIcon,
  "Complex tissue engineering": ComplexTissueIcon,
  "Research-driven applications": ResearchNetworkIcon,
  "Tissue engineering & regenerative medicine": HydrogelIcon,
  "Organ-on-chip & microphysiological systems": OrganOnChipIcon,
  "Bioinspired materials & soft-matter physics": LatticeIcon,
};

/** Resolves an application's title to its schematic diagram, or `null` when
    no diagram has been made for it yet (falls back to the plain
    "image coming soon" placeholder in that case). */
export function getApplicationDiagram(title: string): React.ReactElement | null {
  const Cmp = DIAGRAMS[title];
  return Cmp ? <Cmp /> : null;
}
