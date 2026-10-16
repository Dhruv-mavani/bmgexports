// Single source of truth for site-wide facts used by metadata, structured data and llms.txt.

export const SITE = {
  name: "BGM Exports",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bgmexports.vercel.app",
  tagline: "Brilliance, exported with integrity.",
  description:
    "BGM Exports supplies certified diamonds, selected with care and delivered to jewellers, designers and collectors worldwide. Browse the collection and send an enquiry.",
  keywords: [
    "certified diamonds",
    "diamond exporter",
    "blue diamonds",
    "fancy blue diamond",
    "GIA certified diamonds",
    "IGI certified diamonds",
    "wholesale diamonds",
    "loose diamonds",
    "BGM Exports",
  ],
} as const;

export const CONTACT = {
  email: "vasugodhani651@gmail.com",
  // Street address as given by the owner. City, state and PIN code are not yet known.
  addressLines: ["Plot No. 29, 2nd Floor", "Near Mini Bazar", "Opposite Kamla Estate"],
} as const;

export const abs = (path: string) => new URL(path, SITE.url).toString();

// Plain-language gemology answers, reused by the FAQ page, its structured data and llms.txt.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What does BGM Exports sell?",
    a: "BGM Exports supplies certified diamonds to jewellers, designers and collectors worldwide. You can browse the collection online and send an enquiry for availability and pricing.",
  },
  {
    q: "Are your diamonds certified?",
    a: "Yes. Every stone we offer is graded by an independent gemological laboratory, GIA or IGI, and the certificate is listed with the stone.",
  },
  {
    q: "How do I buy a diamond from BGM Exports?",
    a: "Choose a stone in the collection and press 'Enquire about this stone', or use the contact page to describe what you need. We reply with availability and pricing.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We supply buyers worldwide and ship with insurance.",
  },
  {
    q: "What are the 4Cs of a diamond?",
    a: "The 4Cs are cut, colour, clarity and carat. Cut is how well the stone is proportioned and polished to return light. Colour is the body colour or the lack of it. Clarity is how few inclusions and blemishes are visible under 10× magnification. Carat is weight: one carat is 0.2 grams.",
  },
  {
    q: "What is a fancy blue diamond?",
    a: "A fancy blue diamond is a diamond whose body colour is distinctly blue. In coloured diamonds, a more saturated, richer hue is rarer and generally more valuable.",
  },
  {
    q: "What are the parts of a diamond?",
    a: "A brilliant-cut diamond has five main parts: the table (the flat top facet that lets light in and out), the crown (the upper section whose facets split light into fire), the girdle (the thin outer edge where the stone is held), the pavilion (the lower cone whose facets reflect light back up), and the culet (the tiny point at the bottom of the pavilion).",
  },
  {
    q: "What does carat mean?",
    a: "Carat is a unit of weight, not size. One carat equals 0.2 grams, and prices rise steeply as carat weight increases.",
  },
];
