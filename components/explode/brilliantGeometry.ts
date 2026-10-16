import * as THREE from "three";

// Standard round brilliant (57 facets), girdle radius 1:
//   table ≈ 57% of diameter, crown height ≈ 16% of diameter, pavilion depth ≈ 43%, pavilion angle ≈ 40.7°.
// Each separable part is a closed solid with flat-shaded facets so a ray-traced refraction material can
// bounce light inside it, even when the parts are pulled apart.

const TAU = Math.PI * 2;
const polar = (angleDeg: number, r: number, y: number) => {
  const a = (angleDeg / 360) * TAU;
  return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
};

export const DIM = {
  girdleHalf: 0.03, // girdle spans y = ±0.03
  crownTop: 0.35, // table plane
  slab: 0.04, // thickness of the separable table plate
  culet: -0.892, // pavilion depth is 43% of the diameter below the girdle
};

type Tri = [THREE.Vector3, THREE.Vector3, THREE.Vector3];

function toGeometry(tris: Tri[], center: THREE.Vector3) {
  const pos: number[] = [];
  const c = new THREE.Vector3();
  const n = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  for (const [a, ...rest] of tris) {
    let [b, d] = rest;
    c.copy(a).add(b).add(d).divideScalar(3).sub(center);
    n.copy(e1.subVectors(b, a).clone().cross(e2.subVectors(d, a)));
    if (n.dot(c) < 0) [b, d] = [d, b]; // wind every face outward
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, d.x, d.y, d.z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals(); // non-indexed, so normals are per-face (flat)
  return g;
}

const fan = (ring: THREE.Vector3[], centre: THREE.Vector3): Tri[] =>
  ring.map((p, i) => [centre, p, ring[(i + 1) % ring.length]]);

// A prism, or a frustum when rTop differs from r.
const prism = (r: number, segs: number, y0: number, y1: number, rTop = r): Tri[] => {
  const lo = Array.from({ length: segs }, (_, i) => polar((360 / segs) * i, r, y0));
  const hi = Array.from({ length: segs }, (_, i) => polar((360 / segs) * i, rTop, y1));
  const tris: Tri[] = [...fan(lo, new THREE.Vector3(0, y0, 0)), ...fan(hi, new THREE.Vector3(0, y1, 0))];
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs;
    tris.push([lo[i], lo[j], hi[j]], [lo[i], hi[j], hi[i]]);
  }
  return tris;
};

export function buildBrilliant() {
  const { girdleHalf: gh, crownTop, slab, culet } = DIM;
  const tableY = crownTop - slab;
  const tableR = 0.617; // circumradius of the octagonal table (flats ≈ 57% of the girdle diameter)
  // The table plate tapers at the same slope as the crown so the assembled stone has no step.
  const crownSlope = (1 - tableR) / (crownTop - gh);
  const tableBaseR = tableR + crownSlope * slab;
  const pavilionDepth = -gh - culet;

  // Girdle ring points (16), shared by crown and pavilion.
  const gTop = Array.from({ length: 16 }, (_, j) => polar(22.5 * j, 1, gh));
  const gBot = Array.from({ length: 16 }, (_, j) => polar(22.5 * j, 1, -gh));

  // ── Crown: 8 star + 8 bezel (kite) + 16 upper-girdle facets, plus the table ──
  const T = Array.from({ length: 8 }, (_, k) => polar(45 * k, tableBaseR, tableY));
  const S = Array.from({ length: 8 }, (_, k) => polar(45 * k + 22.5, 0.785, gh + 0.17));
  const crown: Tri[] = [];
  for (let k = 0; k < 8; k++) {
    const k1 = (k + 1) % 8;
    const prev = (k + 7) % 8;
    crown.push([T[k], T[k1], S[k]]); // star facet
    crown.push([T[k], S[prev], gTop[2 * k]], [T[k], gTop[2 * k], S[k]]); // bezel kite
    crown.push([S[k], gTop[2 * k + 1], gTop[2 * k]], [S[k], gTop[(2 * k + 2) % 16], gTop[2 * k + 1]]); // upper girdle
  }
  crown.push(...fan(T, new THREE.Vector3(0, tableY, 0))); // top cap (under the table plate)
  crown.push(...fan(gTop, new THREE.Vector3(0, gh, 0))); // base cap (sits on the girdle)

  // ── Pavilion: 8 long main facets + 16 lower-girdle facets, meeting at the culet ──
  // The culet tip is cut off as its own small part (below the plane y = cutY) so it can be shown separately.
  const C = new THREE.Vector3(0, culet, 0);
  const P = Array.from({ length: 8 }, (_, k) => polar(45 * k + 22.5, 0.27, -gh - 0.75 * pavilionDepth));
  const cutY = culet + 0.15;
  const along = (to: THREE.Vector3) => C.clone().lerp(to, (cutY - C.y) / (to.y - C.y));
  const A = Array.from({ length: 8 }, (_, k) => along(gBot[2 * k])); // on the main-facet ridges (angle 45k)
  const B = Array.from({ length: 8 }, (_, k) => along(P[k])); // on the lower-girdle ridges (angle 45k+22.5)
  const cutRing: THREE.Vector3[] = [];
  for (let k = 0; k < 8; k++) cutRing.push(A[k], B[k]);
  const cutCentre = new THREE.Vector3(0, cutY, 0);

  const pavilion: Tri[] = [];
  const tip: Tri[] = [];
  for (let k = 0; k < 8; k++) {
    const prev = (k + 7) % 8;
    // Main kite above the cut (hexagon, fanned from its girdle point).
    pavilion.push([gBot[2 * k], P[k], B[k]], [gBot[2 * k], B[k], A[k]], [gBot[2 * k], A[k], B[prev]], [gBot[2 * k], B[prev], P[prev]]);
    pavilion.push([P[k], gBot[2 * k], gBot[2 * k + 1]], [P[k], gBot[2 * k + 1], gBot[(2 * k + 2) % 16]]); // lower girdle
    // Main kite below the cut: the culet tip.
    tip.push([C, B[prev], A[k]], [C, A[k], B[k]]);
  }
  pavilion.push(...fan(gBot, new THREE.Vector3(0, -gh, 0))); // top cap (under the girdle)
  pavilion.push(...fan(cutRing, cutCentre)); // bottom cap where the tip was removed
  tip.push(...fan(cutRing, cutCentre)); // tip's top cap

  return {
    table: toGeometry(prism(tableBaseR, 8, tableY, crownTop, tableR), new THREE.Vector3(0, (tableY + crownTop) / 2, 0)),
    crown: toGeometry(crown, new THREE.Vector3(0, 0.18, 0)),
    girdle: toGeometry(prism(1, 16, -gh, gh), new THREE.Vector3(0, 0, 0)),
    pavilion: toGeometry(pavilion, new THREE.Vector3(0, -0.4, 0)),
    culet: toGeometry(tip, new THREE.Vector3(0, (culet + cutY) / 2, 0)),
  };
}
