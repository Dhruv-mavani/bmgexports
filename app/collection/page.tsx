import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FilterableGrid from "@/components/FilterableGrid";
import SectionHeading from "@/components/SectionHeading";
import { diamonds, stoneName } from "@/data/diamonds";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collection — Certified Blue Diamonds",
  description:
    "Browse certified blue diamonds from BGM Exports in radiant, cushion and oval cuts. Filter by shape and carat, then enquire about any stone.",
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
              name: "BGM Exports diamond collection",
              url: abs("/collection"),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: diamonds.length,
                itemListElement: diamonds.map((d, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: abs(`/collection/${d.id}`),
                  name: `${stoneName(d)} diamond`,
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
      <SectionHeading level={1} eyebrow="Collection" title="Certified diamonds" intro="Filter by shape and size to find your stone." />
      <div className="mt-12">
        <FilterableGrid />
      </div>
    </section>
    </>
  );
}
