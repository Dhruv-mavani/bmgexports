import Link from "next/link";
import type { Diamond } from "@/data/diamonds";
import DiamondCard from "./DiamondCard";

interface FeaturedStonesSectionProps {
  initialDiamonds: Diamond[];
}

export default function FeaturedStonesSection({ initialDiamonds }: FeaturedStonesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-ice/20 to-white py-24 sm:py-28 border-y border-mist/70">
      {/* Ambient diamond luster background highlight */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(220,232,250,0.5),transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Curated Luxury Section Header */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 border border-mist/80 bg-white/80 px-3.5 py-1 text-[10px] uppercase tracking-[0.3em] text-royal shadow-2xs backdrop-blur-xs">
            <span className="text-[7px]">◆</span>
            <span>Featured</span>
            <span className="text-[7px]">◆</span>
          </div>

          <h2 className="mt-4 font-serif text-3xl text-navy sm:text-4xl lg:text-5xl font-normal tracking-tight">
            Selected Stones
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate max-w-2xl mx-auto">
            A look at the stones currently in stock. Each has its own stock number: quote it when you enquire.
          </p>

          {/* Centered fine hairline divider with diamond ornament */}
          <div className="mt-6 flex items-center justify-center gap-3 text-mist" aria-hidden>
            <span className="h-px w-12 bg-mist" />
            <span className="text-royal text-xs">◆</span>
            <span className="h-px w-12 bg-mist" />
          </div>
        </header>

        {/* Grid of Vitrine Stones */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {initialDiamonds.map((diamond, idx) => (
            <DiamondCard key={diamond.id} diamond={diamond} priority={idx === 0} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/collection" className="text-sm uppercase tracking-[0.2em] text-royal hover:underline">
            View full collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
