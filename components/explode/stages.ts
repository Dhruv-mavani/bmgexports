// Scroll stages for the pinned diamond section. `start` is the scroll progress (0–1) at which a stage begins.
// Copy is placeholder-quality general gemology — edit freely.

export type Stage = { start: number; eyebrow: string; title: string; body: string; cta?: boolean };

export const stages: Stage[] = [
  { start: 0, eyebrow: "Fine diamonds", title: "Brilliance, exported with integrity.", body: "Certified diamonds, selected with care and delivered to jewellers and collectors worldwide.", cta: true },
  { start: 0.12, eyebrow: "Part 1 of 5", title: "Table", body: "The flat top facet. It is the window that lets light in and back out." },
  { start: 0.24, eyebrow: "Part 2 of 5", title: "Crown", body: "The upper section. Its facets split white light into flashes of fire." },
  { start: 0.36, eyebrow: "Part 3 of 5", title: "Girdle", body: "The thin outer edge where the stone is held, and its widest point." },
  { start: 0.48, eyebrow: "Part 4 of 5", title: "Pavilion", body: "The lower cone. Its mirror-like facets bounce light back up to your eye." },
  { start: 0.6, eyebrow: "Part 5 of 5", title: "Culet", body: "The tiny point at the very bottom of the pavilion, polished flat so it never chips." },
  { start: 0.9, eyebrow: "Complete", title: "Five parts, one stone", body: "Every diamond we sell is graded and inspected on all of them.", cta: true },
];

export function stageAt(progress: number) {
  let index = 0;
  for (let i = 0; i < stages.length; i++) if (progress >= stages[i].start) index = i;
  return index;
}

export const partNames = ["Table", "Crown", "Girdle", "Pavilion", "Culet"];

