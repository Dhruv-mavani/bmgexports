"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { certificationLabel, fmtCarat, originLabel, stoneCode, stonePath, type Diamond } from "@/data/diamonds";

export interface DiamondCardProps {
  diamond: Diamond;
  priority?: boolean;
}

export default function DiamondCard({ diamond, priority = false }: DiamondCardProps) {
  const [view, setView] = useState<"up" | "sheet">("up");

  const imageSrc = view === "up" ? diamond.image : diamond.sheet;

  return (
    <article className="group relative flex flex-col bg-white border border-mist transition-all duration-500 hover:border-royal/60 hover:shadow-[0_20px_40px_-15px_rgba(15,42,82,0.1)]">
      {/* Pedestal Image Display */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-white via-ice/20 to-[#f2f6fc] flex items-center justify-center p-4">
        {/* Soft diamond glow background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,232,250,0.6),transparent_70%)]" />

        <Link
          href={stonePath(diamond)}
          className="relative block h-full w-full"
          aria-label={`View ${fmtCarat(diamond.carat)} carat ${diamond.shape} diamond`}
        >
          <Image
            src={imageSrc}
            alt={`${diamond.shape} cut diamond, stock number ${stoneCode(diamond)}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Multi-view Switcher Toggle */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 border border-mist/80 shadow-xs">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setView("up");
            }}
            aria-label="View face-up image"
            className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] transition-colors ${
              view === "up" ? "bg-navy text-white font-medium" : "text-slate hover:text-navy"
            }`}
          >
            Face
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setView("sheet");
            }}
            aria-label="View 4-angle cut sheet"
            className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] transition-colors ${
              view === "sheet" ? "bg-navy text-white font-medium" : "text-slate hover:text-navy"
            }`}
          >
            4-Angle
          </button>
        </div>
      </div>

      {/* Gemological Information Dossier */}
      <div className="flex flex-col flex-grow justify-between border-t border-mist/70 p-5 bg-white">
        <div>
          {/* Carat & Shape Headline */}
          <Link href={stonePath(diamond)} className="block">
            <h3 className="font-serif text-2xl sm:text-[1.7rem] text-navy transition-colors group-hover:text-royal leading-tight">
              {fmtCarat(diamond.carat)} <span className="font-sans text-xs tracking-[0.2em] uppercase text-slate font-medium">CT</span> {diamond.shape}
            </h3>
            <p className="mt-1 text-xs text-slate tracking-wide">
              {[diamond.color && `Colour ${diamond.color}`, diamond.clarity].filter(Boolean).join(" · ")}
            </p>
            {/* Origin and certification are always spelled out when recorded (lab-grown stones must be labelled). */}
            {(originLabel(diamond) || certificationLabel(diamond)) && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {originLabel(diamond) && (
                  <li className="border border-navy/40 bg-navy/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-navy">{originLabel(diamond)}</li>
                )}
                {certificationLabel(diamond) && (
                  <li className="border border-mist bg-ice px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-royal">{certificationLabel(diamond)}</li>
                )}
              </ul>
            )}
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate/70">{stoneCode(diamond)}</p>
          </Link>
        </div>

        {/* Action Row */}
        <div className="mt-6 flex items-center justify-between border-t border-mist/50 pt-3">
          <Link
            href={stonePath(diamond)}
            className="group/link inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium text-navy transition-colors group-hover:text-royal"
          >
            <span>Explore Stone</span>
            <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </Link>

          <Link
            href={`/contact?stone=${encodeURIComponent(stoneCode(diamond))}`}
            className="text-[11px] uppercase tracking-[0.18em] text-slate hover:text-royal transition-colors"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
