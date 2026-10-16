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

const select = "border border-mist bg-white px-4 py-2 text-sm text-navy outline-none focus:border-royal";

export default function FilterableGrid() {
  const [shape, setShape] = useState<Shape | "">("");
  const [range, setRange] = useState(0);

  const results = useMemo(() => {
    const { min, max } = caratRanges[range];
    return diamonds.filter((d) => (!shape || d.shape === shape) && d.carat >= min && d.carat < max);
  }, [shape, range]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <select aria-label="Shape" value={shape} onChange={(e) => setShape(e.target.value as Shape | "")} className={select}>
          <option value="">All shapes</option>
          {shapes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Carat" value={range} onChange={(e) => setRange(Number(e.target.value))} className={select}>
          {caratRanges.map((r, i) => (
            <option key={r.label} value={i}>{r.label}</option>
          ))}
        </select>
      </div>
      {results.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((d) => (
            <DiamondCard key={d.id} diamond={d} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-slate">No stones match these filters.</p>
      )}
    </>
  );
}
