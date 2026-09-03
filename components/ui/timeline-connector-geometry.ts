/**
 * Geometry for the timeline connector: the ribbon that snakes between the
 * nodes of `3d-interactive-timeline`.
 *
 * The timeline alternates cards left/right of a centre rail, so at any given
 * vertical band exactly one half is empty. Each segment bows into that empty
 * half and is back on the rail *before* the next card begins, then drops
 * straight down into the node.
 *
 * That shape is collision-free by construction rather than by tuning:
 *
 *   - the bow leans away from its own card, so it can never touch it;
 *   - the previous card on the bow side ends a full card gap above the node
 *     the bow starts from;
 *   - the next card on the bow side starts below where the bow has already
 *     rejoined the rail.
 *
 * Each half of the bow is a cubic with vertical tangents at both ends, so the
 * node → bow → apex → rail → node chain is smooth throughout, with no kink
 * where the curve meets the straight run into a node.
 *
 * Every amplitude is derived from *measured* element boxes, so the curve
 * collapses to a plain straight rail on narrow screens, where there is no free
 * half to bow into.
 */

export type NodeBox = {
  /** Node centre, relative to the list box. */
  x: number;
  y: number;
  /** Card box, relative to the list box. */
  cardLeft: number;
  cardRight: number;
  cardTop: number;
};

/**
 * Control-point strength. Exactly 0.5 puts both control points at the same
 * height, which makes the vertical component provably monotonic, required so
 * scroll depth can be mapped onto the path (see `sampleVerticalToLength`).
 */
const K = 0.5;

/** Never bow wider than this, however much room there is. */
const MAX_AMPLITUDE = 320;

/** Breathing room kept between the curve and any card edge. */
const CLEARANCE = 12;

/** Below this a bow reads as a wobble, so draw a straight rail instead. */
const MIN_AMPLITUDE = 20;

/** How wide the bow may get relative to the vertical distance it has to do it in. */
const HEIGHT_RATIO = 0.5;

/** How much of the free half the bow is allowed to eat. */
const ROOM_RATIO = 0.72;

function amplitudeFor(bowHeight: number, room: number): number {
  return Math.max(
    0,
    Math.min(
      (room - CLEARANCE) * ROOM_RATIO, // stay well inside the list box
      bowHeight * HEIGHT_RATIO, // never wider than the run it has to arc over
      MAX_AMPLITUDE
    )
  );
}

/**
 * Builds the connector path. Returns an empty string when there is nothing
 * meaningful to draw.
 */
export function buildConnectorPath(nodes: NodeBox[], listWidth: number): string {
  if (nodes.length < 2 || listWidth <= 0) return "";

  const n = (v: number) => v.toFixed(2);
  let d = `M ${n(nodes[0].x)} ${n(nodes[0].y)}`;

  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i];
    const to = nodes[i + 1];

    // Rejoin the rail before the next card starts, then drop straight in.
    const rejoinY = Math.min(to.cardTop - CLEARANCE, to.y);
    const bowHeight = rejoinY - from.y;

    if (bowHeight <= 0) {
      d += ` L ${n(to.x)} ${n(to.y)}`;
      continue;
    }

    // Bow away from the card this node belongs to, into the empty half.
    const cardCentre = (from.cardLeft + from.cardRight) / 2;
    const dir: 1 | -1 = cardCentre < from.x ? 1 : -1;
    const room = dir === 1 ? listWidth - from.x : from.x;
    const amp = amplitudeFor(bowHeight, room);

    if (amp < MIN_AMPLITUDE) {
      d += ` L ${n(to.x)} ${n(to.y)}`;
      continue;
    }

    const apexX = from.x + amp * dir;
    const apexY = from.y + bowHeight / 2;
    const half = bowHeight / 2;

    // Out to the apex: vertical leaving the node, vertical arriving at the apex.
    d += ` C ${n(from.x)} ${n(from.y + half * K)}, ${n(apexX)} ${n(apexY - half * K)}, ${n(apexX)} ${n(apexY)}`;
    // Back to the rail, mirrored.
    d += ` C ${n(apexX)} ${n(apexY + half * K)}, ${n(to.x)} ${n(rejoinY - half * K)}, ${n(to.x)} ${n(rejoinY)}`;

    if (to.y > rejoinY) d += ` L ${n(to.x)} ${n(to.y)}`;
  }

  return d;
}

export type ConnectorSample = {
  /** Fraction along the path, for stroke drawing. */
  lengthFraction: number;
  x: number;
  y: number;
  /** Tangent direction in degrees, for aiming the arrow. */
  angle: number;
};

/**
 * Pre-samples the path into flat arrays.
 *
 * Two problems solved at once:
 *
 * 1. Scroll progress is vertical, but stroke drawing and point lookup are by
 *    arc length, and the bows make those diverge badly. Without the mapping
 *    the arrow runs ahead of the card the reader is actually looking at.
 *
 * 2. `getTotalLength` / `getPointAtLength` re-flatten the whole path on every
 *    call. Doing that per scroll frame on a path this long is the difference
 *    between a locked arrow and a laggy one. Everything is sampled once, up
 *    front, so a frame costs a binary search and two lerps.
 *
 * The lookup takes an **absolute y in list coordinates**, not a 0-1 fraction.
 * That distinction matters: the path runs from the first node to the last,
 * which is a full card shorter than the list itself (the first node sits below
 * the list top, and the last card extends well below the last node). Feeding a
 * scroll fraction straight in stretches the path over the list's height and
 * the arrow drifts further above the scroll position on every card.
 *
 * Relies on the path being vertically monotonic, which `buildConnectorPath`
 * guarantees.
 */
// 480 samples over a ~20,000px path resolves the vertical mapping exactly
// (measured: 0.000px error). Going higher only raises the one-time resample
// cost, the arrow's rotation rate is set by the curve, not by this number.
export function sampleConnector(path: SVGPathElement, samples = 480) {
  const total = path.getTotalLength();
  const xs = new Float64Array(samples + 1);
  const ys = new Float64Array(samples + 1);

  for (let i = 0; i <= samples; i++) {
    const p = path.getPointAtLength((i / samples) * total);
    xs[i] = p.x;
    ys[i] = p.y;
  }

  // Central differences give a smoother tangent than sampling two points a
  // couple of pixels apart, and cost nothing at lookup time. The path always
  // descends, so the angle stays within (0deg, 180deg) and never wraps,
  // which is what makes interpolating it safe.
  const angles = new Float64Array(samples + 1);
  for (let i = 0; i <= samples; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(samples, i + 1);
    angles[i] = (Math.atan2(ys[b] - ys[a], xs[b] - xs[a]) * 180) / Math.PI;
  }

  const first = ys[0];
  const last = ys[samples];

  /** Absolute y in list coordinates → everything needed to draw that moment. */
  return function sampleAtY(y: number): ConnectorSample {
    if (last <= first) {
      return { lengthFraction: 0, x: xs[0], y: ys[0], angle: angles[0] };
    }

    // Above the first node or below the last, the arrow parks on the end.
    const targetY = Math.min(Math.max(y, first), last);

    let lo = 0;
    let hi = samples;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (ys[mid] < targetY) lo = mid;
      else hi = mid;
    }

    const segment = ys[hi] - ys[lo];
    const t = segment > 1e-6 ? (targetY - ys[lo]) / segment : 0;

    return {
      lengthFraction: (lo + t) / samples,
      x: xs[lo] + (xs[hi] - xs[lo]) * t,
      y: ys[lo] + (ys[hi] - ys[lo]) * t,
      angle: angles[lo] + (angles[hi] - angles[lo]) * t,
    };
  };
}
