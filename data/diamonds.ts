export type Shape = "Radiant" | "Cushion" | "Oval";

export type Diamond = {
  id: string;
  shape: Shape;
  carat: number;
  color: string;
  clarity: string;
  /** Not yet supplied for these stones; shown only when present. */
  cut?: string;
  certificate?: "GIA" | "IGI";
  /** Cropped "up view" used on cards. */
  image: string;
  /** Full multi-view sheet used on the detail page. */
  sheet: string;
  featured?: boolean;
};

export const shapes: Shape[] = ["Radiant", "Cushion", "Oval"];

// Photos are real. Carat, colour and clarity are the owner's figures; cut and certificate are not yet supplied.
export const diamonds: Diamond[] = [
  { id: "bgm-001", shape: "Radiant", carat: 1.324, color: "H", clarity: "VS1", image: "/images/radiant-up.jpg", sheet: "/images/radiant-sheet.jpg", featured: true },
  { id: "bgm-002", shape: "Cushion", carat: 1.004, color: "J", clarity: "VS2", image: "/images/cushion-up.jpg", sheet: "/images/cushion-sheet.jpg", featured: true },
  { id: "bgm-003", shape: "Oval", carat: 1.563, color: "L", clarity: "VS1", image: "/images/oval-up.jpg", sheet: "/images/oval-sheet.jpg", featured: true },
];

export const fmtCarat = (n: number) => n.toFixed(3);
/** e.g. "1.324 ct Radiant" */
export const stoneName = (d: Diamond) => `${fmtCarat(d.carat)} ct ${d.shape}`;
/** e.g. "H colour, VS1 clarity" (+ cut / certificate when known) */
export const stoneSummary = (d: Diamond) =>
  [`${d.color} colour`, `${d.clarity} clarity`, d.cut && `${d.cut} cut`, d.certificate && `${d.certificate} certified`].filter(Boolean).join(", ");

export const getDiamond = (id: string) => diamonds.find((d) => d.id === id);
