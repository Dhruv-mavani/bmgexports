export type Shape = "Radiant" | "Cushion" | "Oval" | "Princess";

export type Diamond = {
  /**
   * Permanent stock number, lower-case in URLs and shown upper-case ("BMG-RAD-0001").
   * Format: BMG-<shape code>-<running number>. The running number is global, never reused and never
   * changes, even if a stone's specs are later corrected, so an ID printed on an invoice stays valid.
   */
  id: string;
  shape: Shape;
  carat: number;
  /** Colour grade. Optional: not every stone has one on record yet. */
  color?: string;
  clarity: string;
  /**
   * Set only when a stone is lab-grown, with how it was grown. Lab-grown stones are always labelled as such
   * on the site. Leave unset when the origin is not confirmed: the site then says nothing about origin.
   */
  labGrown?: "CVD" | "HPHT";
  /** True only when a stone is explicitly sold without a grading report. */
  nonCertified?: boolean;
  /** Not yet supplied for these stones; shown only when present. */
  cut?: string;
  /** Face-up photo used on cards. */
  image: string;
  /** Full multi-view sheet used on the detail page. */
  sheet: string;
  featured?: boolean;
  /** Earlier IDs of this stone; their old URLs redirect to the current one. */
  legacyIds?: string[];
};

export const shapes: Shape[] = ["Radiant", "Cushion", "Oval", "Princess"];

/** Three-letter shape codes used inside stock numbers. Add one when a new shape is introduced. */
export const SHAPE_CODES: Record<Shape, string> = { Radiant: "RAD", Cushion: "CSH", Oval: "OVL", Princess: "PRN" };

// Photos are real. Carat, colour, clarity, origin and certification status are the owner's figures; cut is not yet supplied.
export const diamonds: Diamond[] = [
  { id: "bmg-rad-0001", labGrown: "CVD", nonCertified: true, legacyIds: ["bmg-001", "bgm-001"], shape: "Radiant", carat: 1.324, color: "H", clarity: "VS1", image: "/images/radiant-face.jpg", sheet: "/images/radiant-sheet.jpg", featured: true },
  { id: "bmg-csh-0002", labGrown: "CVD", nonCertified: true, legacyIds: ["bmg-002", "bgm-002"], shape: "Cushion", carat: 1.004, color: "J", clarity: "VS2", image: "/images/cushion-face.jpg", sheet: "/images/cushion-sheet.jpg", featured: true },
  { id: "bmg-ovl-0003", labGrown: "CVD", nonCertified: true, legacyIds: ["bmg-003", "bgm-003"], shape: "Oval", carat: 1.563, color: "L", clarity: "VS1", image: "/images/oval-face.jpg", sheet: "/images/oval-sheet.jpg", featured: true },
  {
    id: "bmg-prn-0004",
    shape: "Princess",
    carat: 7,
    clarity: "VS1",
    labGrown: "CVD",
    nonCertified: true,
    image: "/images/princess-face.jpg",
    sheet: "/images/princess-sheet.jpg",
  },
];

/** Up to three decimals, never fewer than two: 1.324 → "1.324", 7 → "7.00", 1.5 → "1.50". */
export const fmtCarat = (n: number) => n.toFixed(3).replace(/0$/, "");
/** e.g. "1.324 ct Radiant" */
export const stoneName = (d: Diamond) => `${fmtCarat(d.carat)} ct ${d.shape}`;
/** "CVD lab-grown", or undefined when the origin is not recorded. */
export const originLabel = (d: Diamond) => (d.labGrown ? `${d.labGrown} lab-grown` : undefined);

/** "Non-certified" when a stone is sold without a grading report, otherwise undefined (nothing is claimed). */
export const certificationLabel = (d: Diamond) => (d.nonCertified ? "Non-certified" : undefined);

/** e.g. "H colour, VS1 clarity, CVD lab-grown, non-certified" (only what is recorded) */
export const stoneSummary = (d: Diamond) =>
  [
    d.color && `${d.color} colour`,
    `${d.clarity} clarity`,
    d.cut && `${d.cut} cut`,
    originLabel(d),
    certificationLabel(d)?.replace(/^Non/, "non"),
  ]
    .filter(Boolean)
    .join(", ");

/**
 * The disclosure shown on collection, shape and stone pages, in the footer, the FAQ and llms.txt. It is built
 * from the data, so it stays true as stones are added: it says "all" only while that is actually the case.
 */
export const disclosureText = () => {
  const labGrown = diamonds.filter((d) => d.labGrown);
  const nonCert = diamonds.filter((d) => d.nonCertified);
  const methods = [...new Set(labGrown.map((d) => d.labGrown))].join(" / ");
  const parts: string[] = [];
  if (labGrown.length === diamonds.length) parts.push(`All stones listed here are lab-grown diamonds (${methods}), not natural, mined diamonds.`);
  else if (labGrown.length) parts.push(`Stones marked lab-grown (${methods}) are not natural, mined diamonds.`);
  if (nonCert.length === diamonds.length) parts.push("They are sold non-certified, that is, without a grading report.");
  else if (nonCert.length) parts.push("Stones marked non-certified are sold without a grading report.");
  return parts.join(" ");
};

/** The stock number as shown to people, e.g. "BMG-RAD-0001". */
export const stoneCode = (d: Diamond) => d.id.toUpperCase();

export const shapeSlug = (s: Shape) => s.toLowerCase();
export const getShapeBySlug = (slug: string) => shapes.find((s) => shapeSlug(s) === slug.toLowerCase());
export const diamondsOfShape = (s: Shape) => diamonds.filter((d) => d.shape === s);

/** Canonical URLs: /collection, /collection/<shape>, /collection/<shape>/<stock number>. */
export const shapePath = (s: Shape) => `/collection/${shapeSlug(s)}`;
export const stonePath = (d: Diamond) => `${shapePath(d.shape)}/${d.id}`;

/** Case-insensitive, so "BMG-RAD-0001" and "bmg-rad-0001" both resolve. */
export const getDiamond = (id: string) => diamonds.find((d) => d.id === id.toLowerCase());
