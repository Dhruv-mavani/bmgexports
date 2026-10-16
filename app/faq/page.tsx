import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import { abs, FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Diamonds, the 4Cs and Buying",
  description:
    "Answers about buying certified diamonds from BMG Exports: certification, shipping, the 4Cs (cut, colour, clarity, carat), colour grading and the parts of a diamond.",
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
      <section className="relative overflow-hidden py-20 sm:py-24">
        {/* Ambient background light */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_10%,rgba(220,232,250,0.4),transparent_70%)]"
          aria-hidden
        />

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            level={1}
            eyebrow="FAQ"
            title="Questions, answered"
            intro="Short answers about our diamonds and how diamonds work."
          />

          <div className="mt-14 space-y-4">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className="group border border-mist/80 bg-white p-6 sm:p-8 transition-all duration-300 hover:border-royal/50 hover:shadow-xs"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-royal font-semibold pt-1">
                    0{i + 1}
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-[1.65rem] text-navy font-normal leading-snug group-hover:text-royal transition-colors">
                      {f.q}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate font-light">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 border border-mist/80 bg-ice/50 p-8 text-center">
            <span className="text-royal text-xs inline-block mb-2">◆</span>
            <p className="font-serif text-2xl text-navy">Still have a question?</p>
            <p className="mt-2 text-sm text-slate">Our diamond specialists are at your disposal.</p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block bg-navy px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-royal hover:shadow-md"
              >
                Send us an enquiry →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
