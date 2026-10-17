import type { Metadata } from "next";
import Link from "next/link";
import CollectionTabs from "@/components/CollectionTabs";
import JsonLd from "@/components/JsonLd";
import FilterableGrid from "@/components/FilterableGrid";
import LabGrownNotice from "@/components/LabGrownNotice";
import SectionHeading from "@/components/SectionHeading";
import { diamonds, diamondsOfShape, shapePath, shapes, stoneCode, stoneName, stonePath } from "@/data/diamonds";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collection — Diamonds in Stock",
  description:
    "Browse diamonds from BMG Exports in radiant, cushion, oval and princess cuts. Filter by shape and carat, then enquire about any stone.",
  alternates: { canonical: "/collection" },
};

export default function CollectionPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "BMG Exports diamond collection",
              url: abs("/collection"),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: diamonds.length,
                itemListElement: diamonds.map((d, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: abs(stonePath(d)),
                  name: `${stoneCode(d)} — ${stoneName(d)} diamond`,
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Collection", item: abs("/collection") },
              ],
            },
          ],
        }}
      />
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <SectionHeading level={1} eyebrow="Collection" title="Diamonds in stock" intro="Filter by shape and size to find your stone." />
      <div className="mt-10">
        <CollectionTabs current="all" />
      </div>
      <LabGrownNotice className="mx-auto mt-8 max-w-3xl" />
      <nav aria-label="Browse by shape" className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <span className="w-full text-center text-[11px] uppercase tracking-[0.25em] text-slate sm:w-auto">Browse by shape</span>
        {shapes.map((s) => (
          <Link
            key={s}
            href={shapePath(s)}
            className="border border-mist bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate transition-colors hover:border-royal/50 hover:text-navy"
          >
            {s} <span className="ml-1 text-[10px] opacity-75">({diamondsOfShape(s).length})</span>
          </Link>
        ))}
      </nav>
      <div className="mt-10">
        <FilterableGrid />
      </div>
    </section>
    </>
  );
}
