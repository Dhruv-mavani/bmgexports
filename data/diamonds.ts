export type Shape = "Radiant" | "Cushion" | "Oval";

export type Diamond = {
  id: string;
  shape: Shape;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  certificate: "GIA" | "IGI";
  /** Cropped "up view" used on cards. */
  image: string;
  /** Full multi-view sheet used on the detail page. */
  sheet: string;
  featured?: boolean;
};

export const shapes: Shape[] = ["Radiant", "Cushion", "Oval"];

// Photos are real; carat / colour / clarity / certificate are placeholders — replace with actual stock data.
export const diamonds: Diamond[] = [
  { id: "bgm-001", shape: "Radiant", carat: 1.52, color: "Fancy Blue", clarity: "VS1", cut: "Excellent", certificate: "IGI", image: "/images/radiant-up.jpg", sheet: "/images/radiant-sheet.jpg", featured: true },
  { id: "bgm-002", shape: "Cushion", carat: 1.2, color: "Fancy Blue", clarity: "VVS2", cut: "Excellent", certificate: "IGI", image: "/images/cushion-up.jpg", sheet: "/images/cushion-sheet.jpg", featured: true },
  { id: "bgm-003", shape: "Oval", carat: 2.05, color: "Fancy Blue", clarity: "VS2", cut: "Excellent", certificate: "IGI", image: "/images/oval-up.jpg", sheet: "/images/oval-sheet.jpg", featured: true },
];

export const getDiamond = (id: string) => diamonds.find((d) => d.id === id);
