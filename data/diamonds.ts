export type Shape = "Radiant" | "Cushion" | "Oval" | "Princess";

/** Every stone is in exactly one of these. They are browsable categories, kept out of the stock number on purpose. */
export type Certification = "certified" | "non-certified";

export type Diamond = {
  /**
   * Permanent stock number: "bmg-" plus a four-digit running number, one counter for every stone whatever its
   * shape ("bmg-0001", "bmg-0002", ...). Shown upper-case ("BMG-0001") and lower-case in URLs.
   * It deliberately says nothing about the stone (no shape, certification or origin), so any of those can be
   * corrected later without the ID changing. Never reuse or renumber one: it may be on an invoice.
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
  /** Whether the stone is sold with a grading report. A stone can move category later without its ID changing. */
  certification: Certification;
  /** For certified stones: the lab and, when known, the report number. Shown on the stone's page. */
  certificate?: { lab: string; number?: string };
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

// Photos are real. Carat, colour, clarity, origin and certification status are the owner's figures; cut is not yet supplied.
export const diamonds: Diamond[] = [
  { id: "bmg-0001", labGrown: "CVD", certification: "non-certified", legacyIds: ["bmg-rad-0001", "bmg-001", "bgm-001"], shape: "Radiant", carat: 1.324, color: "H", clarity: "VS1", image: "/images/radiant-face.jpg", sheet: "/images/radiant-sheet.jpg", featured: true },
  { id: "bmg-0002", labGrown: "CVD", certification: "non-certified", legacyIds: ["bmg-csh-0002", "bmg-002", "bgm-002"], shape: "Cushion", carat: 1.004, color: "J", clarity: "VS2", image: "/images/cushion-face.jpg", sheet: "/images/cushion-sheet.jpg", featured: true },
  { id: "bmg-0003", labGrown: "CVD", certification: "non-certified", legacyIds: ["bmg-ovl-0003", "bmg-003", "bgm-003"], shape: "Oval", carat: 1.563, color: "L", clarity: "VS1", image: "/images/oval-face.jpg", sheet: "/images/oval-sheet.jpg", featured: true },
  {
    id: "bmg-0004",
    legacyIds: ["bmg-prn-0004"],
    shape: "Princess",
    carat: 7,
    clarity: "VS1",
    labGrown: "CVD",
    certification: "non-certified",
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

/** "Non-certified", or "<lab> certified" / "Certified" for a certified stone. */
export const certificationLabel = (d: Diamond) =>
  d.certification === "non-certified" ? "Non-certified" : d.certificate?.lab ? `${d.certificate.lab} certified` : "Certified";

/** e.g. "H colour, VS1 clarity, CVD lab-grown, non-certified" (only what is recorded) */
export const stoneSummary = (d: Diamond) =>
  [d.color && `${d.color} colour`, `${d.clarity} clarity`, d.cut && `${d.cut} cut`, originLabel(d), certificationLabel(d).toLowerCase().replace(/^([a-z]{2,5}) certified$/i, (_, lab) => `${lab.toUpperCase()} certified`)]
    .filter(Boolean)
    .join(", ");

/**
 * The disclosure shown on collection, shape and stone pages, in the footer, the FAQ and llms.txt. It is built
 * from the data, so it stays true as stones are added: it says "all" only while that is actually the case.
 */
export const disclosureText = () => {
  const labGrown = diamonds.filter((d) => d.labGrown);
  const nonCert = diamonds.filter((d) => d.certification === "non-certified");
  const methods = [...new Set(labGrown.map((d) => d.labGrown))].join(" / ");
  const parts: string[] = [];
  if (labGrown.length === diamonds.length) parts.push(`All stones listed here are lab-grown diamonds (${methods}), not natural, mined diamonds.`);
  else if (labGrown.length) parts.push(`Stones marked lab-grown (${methods}) are not natural, mined diamonds.`);
  if (nonCert.length === diamonds.length) parts.push("They are sold non-certified, that is, without a grading report.");
  else if (nonCert.length) parts.push("Stones marked non-certified are sold without a grading report.");
  return parts.join(" ");
};

/** The stock number as shown to people, e.g. "BMG-0001". */
export const stoneCode = (d: Diamond) => d.id.toUpperCase();

export const shapeSlug = (s: Shape) => s.toLowerCase();
export const getShapeBySlug = (slug: string) => shapes.find((s) => shapeSlug(s) === slug.toLowerCase());
export const diamondsOfShape = (s: Shape) => diamonds.filter((d) => d.shape === s);

/** Canonical URLs: /collection, /collection/<shape>, /collection/<shape>/<stock number>. */
export const shapePath = (s: Shape) => `/collection/${shapeSlug(s)}`;
export const stonePath = (d: Diamond) => `${shapePath(d.shape)}/${d.id}`;

/** Case-insensitive, so "BMG-0001" and "bmg-0001" both resolve. */
export const getDiamond = (id: string) => diamonds.find((d) => d.id === id.toLowerCase());

/** Certification categories, in the order they are shown. */
export const certifications: Certification[] = ["certified", "non-certified"];
export const certificationTitle: Record<Certification, string> = { certified: "Certified", "non-certified": "Non-certified" };
export const getCertificationBySlug = (slug: string) => certifications.find((c) => c === slug.toLowerCase());
export const diamondsByCertification = (c: Certification) => diamonds.filter((d) => d.certification === c);
export const certificationPath = (c: Certification) => `/collection/${c}`;

// Fails the build on a data-entry mistake that would otherwise ship quietly.
(() => {
  const seen = new Map<string, string>();
  for (const d of diamonds) {
    for (const id of [d.id, ...(d.legacyIds ?? [])]) {
      if (id !== id.toLowerCase()) throw new Error(`Stock number must be lower-case in the data: ${id}`);
      if (id === d.id && !/^bmg-\d{4}$/.test(id)) throw new Error(`Stock number must look like "bmg-0001" (got "${id}")`);
      if (seen.has(id)) throw new Error(`Duplicate stock number "${id}" (${seen.get(id)} and ${d.id})`);
      seen.set(id, d.id);
    }
  }
})();
