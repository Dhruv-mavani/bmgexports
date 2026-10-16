"use client";

import { useMemo, useState } from "react";
import { diamonds, shapes, type Shape } from "@/data/diamonds";
import DiamondCard from "./DiamondCard";

const caratRanges = [
  { label: "Any carat", min: 0, max: Infinity },
  { label: "Under 1 ct", min: 0, max: 1 },
  { label: "1 – 2 ct", min: 1, max: 2 },
  { label: "2 ct +", min: 2, max: Infinity },
];

export default function FilterableGrid() {
  const [shape, setShape] = useState<Shape | "">("");
  const [range, setRange] = useState(0);

  const results = useMemo(() => {
    const { min, max } = caratRanges[range];
    return diamonds.filter((d) => (!shape || d.shape === shape) && d.carat >= min && d.carat < max);
  }, [shape, range]);

  const hasFilter = shape !== "" || range !== 0;

  return (
    <div>
      {/* Luxury Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-mist/80 bg-white p-4 sm:px-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Shape Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              aria-label="Shape"
              value={shape}
              onChange={(e) => setShape(e.target.value as Shape | "")}
              className="w-full appearance-none border border-mist bg-white pl-4 pr-9 py-2 text-xs uppercase tracking-[0.18em] text-navy outline-none transition-colors hover:border-royal/50 focus:border-royal cursor-pointer"
            >
              <option value="">All shapes</option>
              {shapes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate text-xs" aria-hidden>
              ▼
            </span>
          </div>

          {/* Carat Range Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              aria-label="Carat"
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="w-full appearance-none border border-mist bg-white pl-4 pr-9 py-2 text-xs uppercase tracking-[0.18em] text-navy outline-none transition-colors hover:border-royal/50 focus:border-royal cursor-pointer"
            >
              {caratRanges.map((r, i) => (
                <option key={r.label} value={i}>
                  {r.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate text-xs" aria-hidden>
              ▼
            </span>
          </div>

          {/* Reset Filters */}
          {hasFilter && (
            <button
              type="button"
              onClick={() => {
                setShape("");
                setRange(0);
              }}
              className="text-xs uppercase tracking-[0.18em] text-royal hover:underline px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>

        {/* Counter Pill */}
        <div className="text-[11px] uppercase tracking-[0.2em] text-slate font-mono">
          Showing <span className="font-semibold text-navy">{results.length}</span> of {diamonds.length} stones
        </div>
      </div>

      {/* Grid */}
      {results.length ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((d, idx) => (
            <DiamondCard key={d.id} diamond={d} priority={idx === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-12 border border-mist bg-ice/40 p-12 text-center">
          <span className="inline-block text-royal text-base mb-2">◆</span>
          <p className="font-serif text-2xl text-navy">No stones match these filters.</p>
          <p className="mt-2 text-sm text-slate">Try selecting a different cut or carat weight range.</p>
          <button
            type="button"
            onClick={() => {
              setShape("");
              setRange(0);
            }}
            className="mt-6 inline-block border border-navy px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
