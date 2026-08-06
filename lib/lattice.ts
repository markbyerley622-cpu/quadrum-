/**
 * Geometry for the system lattice — the single object that carries the page.
 *
 * The same set of points holds two positions: a chaotic cloud and an ordered
 * architectural lattice. Scroll interpolates between them, so the object is
 * literally complexity resolving into structure rather than an illustration
 * of it.
 *
 * Everything here is deterministic (seeded PRNG, no Math.random) so the object
 * is identical on every load and every reload.
 */

/** Small, fast, seedable PRNG. */
function mulberry32(seed: number) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Lattice dimensions. 5 × 3 × 4 = 60 points — dense enough to read as a
 *  structure, sparse enough that every edge stays legible. */
export const DIMS = { x: 5, y: 3, z: 4 } as const;
export const NODE_COUNT = DIMS.x * DIMS.y * DIMS.z;

export type Node = {
  /** Ordered position — where the point belongs in the finished structure. */
  ox: number;
  oy: number;
  oz: number;
  /** Chaotic position — where it starts. */
  cx: number;
  cy: number;
  cz: number;
  /** Per-node drift, so the cloud breathes instead of sitting still. */
  phase: number;
  speed: number;
  amp: number;
  /** The few points that resolve into accent — the decisions that mattered. */
  accent: boolean;
};

export type Edge = { a: number; b: number; accent: boolean };

export type Lattice = {
  nodes: Node[];
  /** Structural edges — grid adjacency. Fade IN as the object orders. */
  ordered: Edge[];
  /** Tangled edges — arbitrary coupling. Fade OUT as the object orders. */
  chaotic: Edge[];
};

export function buildLattice(seed = 0x9e3779b9): Lattice {
  const rand = mulberry32(seed);
  const nodes: Node[] = [];

  // Ordered positions: a wide, shallow block. Wider than tall so it reads as
  // architecture rather than as a cube.
  const span = { x: 1.34, y: 0.78, z: 0.8 };

  for (let ix = 0; ix < DIMS.x; ix++) {
    for (let iy = 0; iy < DIMS.y; iy++) {
      for (let iz = 0; iz < DIMS.z; iz++) {
        // Chaotic position: rejection-sampled inside a sphere, so the cloud is
        // a volume rather than a cube with visible corners.
        let cx = 0;
        let cy = 0;
        let cz = 0;
        do {
          cx = rand() * 2 - 1;
          cy = rand() * 2 - 1;
          cz = rand() * 2 - 1;
        } while (cx * cx + cy * cy + cz * cz > 1);

        // Kept close to the ordered extent. A wider cloud sprawls across the
        // whole viewport and stops reading as a single object.
        const R = 1.3;

        nodes.push({
          ox: (ix / (DIMS.x - 1)) * 2 * span.x - span.x,
          oy: (iy / (DIMS.y - 1)) * 2 * span.y - span.y,
          oz: (iz / (DIMS.z - 1)) * 2 * span.z - span.z,
          cx: cx * R,
          cy: cy * R,
          cz: cz * R,
          phase: rand() * Math.PI * 2,
          speed: 0.35 + rand() * 0.5,
          amp: 0.05 + rand() * 0.11,
          accent: false,
        });
      }
    }
  }

  // Four accent points, spread through the volume rather than clustered.
  for (const i of [7, 22, 38, 53]) nodes[i].accent = true;

  const index = (ix: number, iy: number, iz: number) =>
    (ix * DIMS.y + iy) * DIMS.z + iz;

  // Structural edges: grid adjacency along each axis.
  const ordered: Edge[] = [];
  for (let ix = 0; ix < DIMS.x; ix++) {
    for (let iy = 0; iy < DIMS.y; iy++) {
      for (let iz = 0; iz < DIMS.z; iz++) {
        const a = index(ix, iy, iz);
        if (ix + 1 < DIMS.x)
          ordered.push({ a, b: index(ix + 1, iy, iz), accent: false });
        if (iy + 1 < DIMS.y)
          ordered.push({ a, b: index(ix, iy + 1, iz), accent: false });
        if (iz + 1 < DIMS.z)
          ordered.push({ a, b: index(ix, iy, iz + 1), accent: false });
      }
    }
  }

  // Tangled edges: arbitrary long-range coupling — the dependencies nobody
  // chose. A handful are accent: the ones that are actively costing you.
  const chaotic: Edge[] = [];
  const seen = new Set<string>();
  while (chaotic.length < 42) {
    const a = Math.floor(rand() * NODE_COUNT);
    const b = Math.floor(rand() * NODE_COUNT);
    if (a === b) continue;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    chaotic.push({ a, b, accent: chaotic.length % 14 === 0 });
  }

  return { nodes, ordered, chaotic };
}

/* -------------------------------------------------------------- easing --- */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Hermite smoothstep between two thresholds. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* -------------------------------------------------------------- camera --- */

export type Placement = {
  /** Centre as a fraction of viewport width / height. */
  cx: number;
  cy: number;
  /** Scale as a fraction of the viewport's smaller edge. */
  s: number;
  /** Master opacity. */
  a: number;
};

/**
 * Where the object sits, per act.
 *
 * Placement is declared by the sections themselves (`data-lattice` — see
 * components/primitives/Section.tsx) rather than by scroll-progress keyframes.
 * Keyframes were the obvious approach and the wrong one: they are pinned to
 * document proportions, so editing a single paragraph silently slides the
 * object onto a column of text three acts away.
 *
 * Two rules keep this from becoming decoration:
 *
 *  1. It never occupies the side the text is on. Every act is weighted to one
 *     side; the object takes the other. It is an object beside the writing,
 *     never a net laid over it.
 *  2. It is loudest in the hinges, where there is almost nothing to read, and
 *     drops to a fifth of that opacity inside dense acts — present enough to
 *     hold continuity, far too faint to compete.
 */
export const PLACEMENTS = {
  /** Opening: upper right, clear of the headline and the lead below it. */
  hero: { cx: 0.8, cy: 0.36, s: 0.19, a: 0.62 },
  /** Between acts. Nothing to read, so the object gets the moment. */
  hinge: { cx: 0.79, cy: 0.43, s: 0.21, a: 0.85 },
  /** Text on the left, object high on the right. */
  quietRight: { cx: 0.83, cy: 0.26, s: 0.16, a: 0.32 },
  /** Densest acts — pushed into the top corner and almost invisible. */
  farRight: { cx: 0.86, cy: 0.22, s: 0.13, a: 0.2 },
  /** Text on the right, object on the left. */
  quietLeft: { cx: 0.16, cy: 0.3, s: 0.14, a: 0.24 },
  /**
   * Lower left. The one act with no truly empty quadrant, so the object sits
   * behind the figures as a watermark — quiet enough not to muddy them, but
   * present, because this is where the finished structure means something.
   */
  lowLeft: { cx: 0.26, cy: 0.56, s: 0.155, a: 0.24 },
  /** The close. */
  close: { cx: 0.8, cy: 0.4, s: 0.2, a: 0.62 },
} as const;

export type PlacementName = keyof typeof PLACEMENTS;

export function blendPlacement(a: Placement, b: Placement, t: number): Placement {
  return {
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    s: lerp(a.s, b.s, t),
    a: lerp(a.a, b.a, t),
  };
}

/**
 * How ordered the object is, as a fraction of the whole document.
 *
 * Fallback only. Kept for the reduced-motion path, which forces a progress of
 * 1 and just wants the finished structure, and for the first frames before the
 * anchor below has been measured. Prefer `orderAtAnchor`.
 */
export const orderAt = (p: number) => smoothstep(0.2, 0.36, p);

/**
 * How ordered the object is, expressed against the act that earns it.
 *
 * Chaotic through the opening and the proof, resolving across the turn, fully
 * built by the time the method is being explained. That is deliberately locked
 * to the page's light/dark rhythm: chaos happens on the dark surface, order on
 * the light one.
 *
 * Measuring that against a document *fraction* made it fragile — every act that
 * changed length moved the curve out from under the act it was supposed to
 * track, silently. So it is measured against the turn itself instead: `top` and
 * `bottom` are the turn's document-space range and `y` is the viewport centre.
 * Acts can now be added, removed or pinned anywhere on the page and the
 * coupling still holds.
 *
 * The band starts below 0 so the object has begun to settle during the tail of
 * the act before, and completes just short of 1 so the structure is finished as
 * the turn's surface dissolves back to paper.
 */
export function orderAtAnchor(y: number, top: number, bottom: number) {
  const local = (y - top) / Math.max(1, bottom - top);
  return smoothstep(-0.55, 0.9, local);
}
