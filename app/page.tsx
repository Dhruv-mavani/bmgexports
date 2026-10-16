import Link from "next/link";
import type { Metadata } from "next";
import ExplodeSection from "@/components/explode/ExplodeSection";
import FeaturedStonesSection from "@/components/FeaturedStonesSection";
import { diamonds } from "@/data/diamonds";

const trust = [
  { title: "Certified", text: "Every stone graded by GIA or IGI." },
  { title: "Ethically sourced", text: "Conflict-free, fully traceable supply." },
  { title: "Worldwide", text: "Insured shipping to buyers across the globe." },
];

export const metadata: Metadata = {
  title: { absolute: "BMG Exports — Certified Diamonds, Exported Worldwide" },
  description:
    "Certified diamonds, including blue stones, supplied to jewellers, designers and collectors worldwide. Explore the anatomy of a diamond and send an enquiry to BMG Exports.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const featured = diamonds.filter((d) => d.featured);

  return (
    <>
      <ExplodeSection />

      {/* Trust & Provenance Strip */}
      <section className="border-b border-mist bg-gradient-to-b from-white via-ice/20 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <ul className="grid gap-8 sm:gap-0 sm:grid-cols-3 sm:divide-x sm:divide-mist text-center">
            {trust.map((t) => (
              <li key={t.title} className="px-6">
                <span className="inline-block text-royal text-[10px] mb-2" aria-hidden>◆</span>
                <p className="font-serif text-2xl sm:text-3xl text-navy font-normal">{t.title}</p>
                <p className="mt-2 text-sm text-slate leading-relaxed">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Selected Stones */}
      <FeaturedStonesSection initialDiamonds={featured} />

      {/* Bespoke Sourcing Callout */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(31,79,216,0.35),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] uppercase tracking-[0.3em] text-mist backdrop-blur-xs">
            <span className="text-[7px]">◆</span>
            <span>Bespoke Concierge</span>
            <span className="text-[7px]">◆</span>
          </div>

          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            Looking for a specific stone?
          </h2>
          <p className="mt-4 text-mist text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Tell us what you need and we will source it for you.
          </p>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-block bg-white px-8 py-3.5 text-xs sm:text-sm uppercase tracking-[0.25em] text-navy font-medium transition-all duration-300 hover:bg-mist hover:shadow-lg hover:scale-[1.02]"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
