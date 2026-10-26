import { diamonds, disclosureText } from "@/data/diamonds";

// Single source of truth for site-wide facts used by metadata, structured data and llms.txt.

export const SITE = {
  name: "BMG Exports",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bmgexports.vercel.app",
  tagline: "Brilliance, exported with integrity.",
  description:
    "BMG Exports supplies lab-grown diamonds, selected with care and delivered to jewellers, designers and collectors worldwide. Browse the collection and send an enquiry.",
  keywords: [
    "lab grown diamonds",
    "CVD diamonds",
    "diamond exporter",
    "blue diamonds",
    "blue diamond",
    "lab-grown diamonds",
    "wholesale diamonds",
    "loose diamonds",
    "BMG Exports",
  ],
} as const;

const STREET = ["Plot No. 29, 2nd Floor", "Near Mini Bazar", "Opposite Kamla Estate"] as const;

export const CONTACT = {
  email: "vasugodhani651@gmail.com",
  street: STREET,
  // City and state were derived from the owner's PIN code (395006, Varachha, Surat); confirm with the owner.
  locality: "Surat",
  region: "Gujarat",
  postalCode: "395006",
  country: "IN",
  /** Display lines, in order. */
  addressLines: [...STREET, "Surat, Gujarat 395006", "India"],
} as const;

export const abs = (path: string) => new URL(path, SITE.url).toString();

// Plain-language gemology answers, reused by the FAQ page, its structured data and llms.txt.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What does BMG Exports sell?",
    a: "BMG Exports supplies lab-grown diamonds to jewellers, designers and collectors worldwide. It also lists automatic skeleton watches. You can browse the collection and watches online and send an enquiry for availability and pricing.",
  },
  {
    q: "Are your diamonds natural or lab-grown?",
    a: `${disclosureText()} Each stone's card and page also says so.`,
  },
  {
    q: "Are lab-grown diamonds real diamonds?",
    a: "Lab-grown diamonds have the same chemical make-up and crystal structure as natural diamonds, but they are grown in a laboratory instead of being mined. They are not natural diamonds, and their price and value differ from natural stones.",
  },
  {
    q: "Are your diamonds certified?",
    a: diamonds.every((d) => d.certification === "non-certified")
      ? "Not at the moment. The stones currently listed are sold non-certified, without a grading report, and each stone's page says so. Ask us in an enquiry about documentation for a particular stone."
      : "Some stones are sold non-certified, without a grading report, and a stone's page says when that is the case. Ask us in an enquiry about documentation for a particular stone.",
  },
  {
    q: "How do I buy a diamond from BMG Exports?",
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
    q: "How is a diamond's colour graded?",
    a: "Colourless to light-yellow diamonds are graded on a letter scale from D (colourless) to Z (light colour), so D to F is colourless and G to J is near colourless. Strongly coloured 'fancy' diamonds, such as blue or pink, are graded separately by hue and intensity.",
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
