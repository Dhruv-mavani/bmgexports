import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import { abs, FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Diamonds, the 4Cs and Buying",
  description:
    "Answers about buying lab-grown diamonds from BMG Exports: origin, certification, shipping, the 4Cs (cut, colour, clarity, carat), colour grading and the parts of a diamond.",
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

          {/* Native <details> accordion: works without JavaScript, is keyboard and screen-reader friendly, and keeps
              every answer in the page for search engines. Giving the items one shared `name` makes them exclusive
              (opening one closes the other) in browsers that support it. */}
          <div className="mt-14 space-y-3">
            {FAQ.map((f, i) => (
              <details
                key={f.q}
                name="faq"
                open={i === 0}
                className="group border border-mist/80 bg-white transition-colors duration-300 open:border-royal/40 open:shadow-xs hover:border-royal/50"
              >
                <summary className="flex cursor-pointer list-none items-start gap-3 p-5 outline-none focus-visible:ring-2 focus-visible:ring-royal/40 sm:gap-4 sm:p-7 [&::-webkit-details-marker]:hidden">
                  <span className="pt-1.5 font-mono text-xs font-semibold tracking-widest text-royal">0{i + 1}</span>
                  <h2 className="flex-1 font-serif text-xl font-normal leading-snug text-navy transition-colors group-hover:text-royal group-open:text-royal sm:text-[1.55rem]">
                    {f.q}
                  </h2>
                  {/* Plus that turns into a cross when open */}
                  <span
                    className="relative mt-1.5 h-5 w-5 shrink-0 text-royal transition-transform duration-300 group-open:rotate-45"
                    aria-hidden
                  >
                    <span className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                <div className="faq-answer px-5 pb-6 pl-[3.25rem] pr-5 sm:px-7 sm:pb-8 sm:pl-[4.25rem]">
                  <p className="text-sm font-light leading-relaxed text-slate sm:text-base">{f.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-14 border border-mist/80 bg-ice/50 p-8 text-center">
            <span className="text-royal text-xs inline-block mb-2">◆</span>
            <p className="font-serif text-2xl text-navy">Still have a question?</p>
            <p className="mt-2 text-sm text-slate">Send us a message and we will get back to you.</p>
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
