export type Shape = "Radiant" | "Cushion" | "Oval";

export type Diamond = {
  /**
   * Permanent stock number, lower-case in URLs and shown upper-case ("BMG-RAD-0001").
   * Format: BMG-<shape code>-<running number>. The running number is global, never reused and never
   * changes, even if a stone's specs are later corrected, so an ID printed on an invoice stays valid.
   */
  id: string;
  shape: Shape;
  carat: number;
  color: string;
  clarity: string;
  /** Not yet supplied for these stones; shown only when present. */
  cut?: string;
  certificate?: "GIA" | "IGI";
  /** Face-up photo used on cards. */
  image: string;
  /** Full multi-view sheet used on the detail page. */
  sheet: string;
  featured?: boolean;
  /** Earlier IDs of this stone; their old URLs redirect to the current one. */
  legacyIds?: string[];
};

export const shapes: Shape[] = ["Radiant", "Cushion", "Oval"];

/** Three-letter shape codes used inside stock numbers. Add one when a new shape is introduced. */
export const SHAPE_CODES: Record<Shape, string> = { Radiant: "RAD", Cushion: "CSH", Oval: "OVL" };

// Photos are real. Carat, colour and clarity are the owner's figures; cut and certificate are not yet supplied.
export const diamonds: Diamond[] = [
  { id: "bmg-rad-0001", legacyIds: ["bmg-001", "bgm-001"], shape: "Radiant", carat: 1.324, color: "H", clarity: "VS1", image: "/images/radiant-face.jpg", sheet: "/images/radiant-sheet.jpg", featured: true },
  { id: "bmg-csh-0002", legacyIds: ["bmg-002", "bgm-002"], shape: "Cushion", carat: 1.004, color: "J", clarity: "VS2", image: "/images/cushion-face.jpg", sheet: "/images/cushion-sheet.jpg", featured: true },
  { id: "bmg-ovl-0003", legacyIds: ["bmg-003", "bgm-003"], shape: "Oval", carat: 1.563, color: "L", clarity: "VS1", image: "/images/oval-face.jpg", sheet: "/images/oval-sheet.jpg", featured: true },
];

export const fmtCarat = (n: number) => n.toFixed(3);
/** e.g. "1.324 ct Radiant" */
export const stoneName = (d: Diamond) => `${fmtCarat(d.carat)} ct ${d.shape}`;
/** e.g. "H colour, VS1 clarity" (+ cut / certificate when known) */
export const stoneSummary = (d: Diamond) =>
  [`${d.color} colour`, `${d.clarity} clarity`, d.cut && `${d.cut} cut`, d.certificate && `${d.certificate} certified`].filter(Boolean).join(", ");

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
