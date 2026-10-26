export type WatchMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

export type Watch = {
  /**
   * Permanent stock number: "bmg-w-" plus a four-digit running number ("bmg-w-0001"). Shown upper-case and
   * lower-case in URLs. Deliberately says nothing about the watch (colour, finish), so those can be corrected
   * later without the ID changing. Never reuse or renumber one: it may be on an invoice.
   */
  id: string;
  name: string;
  /** Short finish label shown on cards, e.g. "Rose gold". */
  finish: string;
  /** One-line summary for cards and metadata. */
  summary: string;
  /** Longer copy for the detail page. */
  description: string;
  highlights: string[];
  /** Label / value rows for the specification table. */
  specs: [label: string, value: string][];
  /** Selling price in rupees, and the struck-through list price (MRP). */
  price: number;
  mrp: number;
  /** First item is the card image and social preview. */
  media: WatchMedia[];
  featured?: boolean;
};

const VIDEO = "/watches/tonneau-skeleton.mp4";

// Photos, video, copy and the spec table come from the two Tonneau Automatic Skeleton Watch listings on tonneauwatches.in.
// Crystal type is left out on purpose: that listing's copy says sapphire, its spec sheet says mineral glass.
const SHARED_SPECS: Watch["specs"] = [
  ["Movement", "Automatic mechanical, skeleton (JX-2806)"],
  ["Case material", "Stainless steel"],
  ["Case size", "42 × 55 mm"],
  ["Case thickness", "15 mm"],
  ["Case back", "Transparent"],
  ["Strap", "Silicone, pin buckle"],
  ["Strap width", "25 × 20 mm"],
  ["Fits wrist", "170–220 mm"],
  ["Weight", "98 g"],
  ["Water resistance", "3 ATM"],
];

const SHARED_HIGHLIGHTS = [
  "Automatic mechanical movement with an openwork skeleton dial, no battery required",
  "Transparent case back that shows the movement at work",
  "Silicone strap, comfortable for everyday wear",
  "Makes a strong gift for anniversaries and birthdays",
];

export const watches: Watch[] = [
  {
    id: "bmg-w-0001",
    name: "Tonneau Automatic Skeleton Watch, Rose Gold",
    finish: "Rose gold",
    summary: "Automatic skeleton watch with rose gold-tone case, transparent back and a black silicone strap.",
    description:
      "A premium automatic skeleton watch for men. The openwork skull dial shows the movement working in real time, and the transparent case back gives a second view of the mechanism. A rose gold-tone case sits on a black silicone strap, built for both elegance and everyday wear.",
    highlights: SHARED_HIGHLIGHTS,
    specs: [["Finish", "Rose gold-tone case"], ...SHARED_SPECS],
    price: 18600,
    mrp: 24999,
    featured: true,
    media: [
      { type: "image", src: "/watches/tonneau-skeleton-1.png", alt: "Rose gold automatic skeleton watch with a skull dial and black silicone strap" },
      { type: "video", src: VIDEO, poster: "/watches/tonneau-skeleton-1.png", alt: "Video of the automatic skeleton watch" },
      { type: "image", src: "/watches/tonneau-skeleton-2.jpg", alt: "Rose gold skeleton watch with its dimensions and specification table" },
      { type: "image", src: "/watches/tonneau-skeleton-3.jpg", alt: "Transparent case back showing the automatic movement" },
    ],
  },
  {
    id: "bmg-w-0002",
    name: "Tonneau Automatic Skeleton Watch, Stainless Steel",
    finish: "Stainless steel",
    summary: "Automatic skeleton watch with a brushed stainless steel case, transparent back and a black silicone strap.",
    description:
      "The same premium automatic skeleton watch in a brushed stainless steel finish. The openwork skull dial shows the movement working in real time, and the transparent case back gives a second view of the mechanism. A steel case sits on a black silicone strap, built for both elegance and everyday wear.",
    highlights: SHARED_HIGHLIGHTS,
    specs: [["Finish", "Brushed stainless steel"], ...SHARED_SPECS],
    price: 18600,
    mrp: 24999,
    featured: true,
    media: [
      { type: "image", src: "/watches/tonneau-skeleton-b-1.png", alt: "Stainless steel automatic skeleton watch with a skull dial and black silicone strap" },
      { type: "video", src: VIDEO, poster: "/watches/tonneau-skeleton-b-1.png", alt: "Video of the automatic skeleton watch" },
    ],
  },
];

export const watchCode = (w: Watch) => w.id.toUpperCase();
export const watchPath = (w: Watch) => `/watches/${w.id}`;
/** Case-insensitive, so "BMG-W-0001" and "bmg-w-0001" both resolve. */
export const getWatch = (id: string) => watches.find((w) => w.id === id.toLowerCase());

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const fmtPrice = (n: number) => inr.format(n);
export const discountPercent = (w: Watch) => Math.round((1 - w.price / w.mrp) * 100);

// Fails the build on a data-entry mistake that would otherwise ship quietly.
(() => {
  const seen = new Set<string>();
  for (const w of watches) {
    if (!/^bmg-w-\d{4}$/.test(w.id)) throw new Error(`Watch stock number must look like "bmg-w-0001" (got "${w.id}")`);
    if (seen.has(w.id)) throw new Error(`Duplicate watch stock number "${w.id}"`);
    seen.add(w.id);
    if (w.media[0]?.type !== "image") throw new Error(`${w.id}: first media item must be an image`);
  }
})();
