"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type Diamond, type Shape, shapes } from "@/data/diamonds";
import DiamondCard from "./DiamondCard";

interface FeaturedStonesSectionProps {
  initialDiamonds: Diamond[];
}

export default function FeaturedStonesSection({ initialDiamonds }: FeaturedStonesSectionProps) {
  const [selectedShape, setSelectedShape] = useState<Shape | "All">("All");

  const filtered = useMemo(() => {
    if (selectedShape === "All") return initialDiamonds;
    return initialDiamonds.filter((d) => d.shape === selectedShape);
  }, [selectedShape, initialDiamonds]);

  // Compute counts per shape
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: initialDiamonds.length };
    for (const d of initialDiamonds) {
      map[d.shape] = (map[d.shape] || 0) + 1;
    }
    return map;
  }, [initialDiamonds]);

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

        {/* Minimalist Shape Filter Tabs */}
        <nav aria-label="Filter featured stones by shape" className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSelectedShape("All")}
            className={`cursor-pointer px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
              selectedShape === "All"
                ? "bg-navy text-white shadow-xs font-medium"
                : "border border-mist bg-white text-slate hover:border-royal/50 hover:text-navy"
            }`}
          >
            All Cuts <span className="ml-1 text-[10px] opacity-75">({counts.All})</span>
          </button>

          {shapes.map((s) => {
            const count = counts[s] || 0;
            if (count === 0) return null;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedShape(s)}
                className={`cursor-pointer px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                  selectedShape === s
                    ? "bg-navy text-white shadow-xs font-medium"
                    : "border border-mist bg-white text-slate hover:border-royal/50 hover:text-navy"
                }`}
              >
                {s} <span className="ml-1 text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </nav>

        {/* Grid of Vitrine Stones */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((diamond, idx) => (
            <DiamondCard
              key={diamond.id}
              diamond={diamond}
              priority={idx === 0}
            />
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
