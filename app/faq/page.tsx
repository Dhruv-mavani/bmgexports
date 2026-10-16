import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import { abs, FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Diamonds, the 4Cs and Buying",
  description:
    "Answers about buying certified diamonds from BGM Exports: certification, shipping, the 4Cs (cut, colour, clarity, carat), fancy blue diamonds and the parts of a diamond.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "FAQPage",
              "@id": `${abs("/faq")}#faq`,
              url: abs("/faq"),
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "FAQ", item: abs("/faq") },
              ],
            },
          ],
        }}
      />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading level={1} eyebrow="FAQ" title="Questions, answered" intro="Short answers about our diamonds and how diamonds work." />
        <dl className="mt-12 divide-y divide-mist border-y border-mist">
          {FAQ.map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-serif text-2xl text-navy">{f.q}</dt>
              <dd className="mt-2 text-slate">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-center text-slate">
          Still have a question?{" "}
          <Link href="/contact" className="text-royal underline underline-offset-4">
            Send us an enquiry
          </Link>
          .
        </p>
      </section>
    </>
  );
}
