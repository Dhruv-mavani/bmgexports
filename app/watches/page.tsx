import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import WatchCard from "@/components/WatchCard";
import { watchCode, watchPath, watches } from "@/data/watches";
import { abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "Watches — Automatic Skeleton Watches",
  description: "Automatic skeleton watches from BMG Exports with transparent case backs and silicone straps. Enquire about any watch for availability.",
  alternates: { canonical: "/watches" },
};

export default function WatchesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "BMG Exports watches",
              url: abs("/watches"),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: watches.length,
                itemListElement: watches.map((w, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: abs(watchPath(w)),
                  name: `${watchCode(w)} — ${w.name}`,
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Watches", item: abs("/watches") },
              ],
            },
          ],
        }}
      />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          level={1}
          eyebrow="Watches"
          title="Automatic skeleton watches"
          intro="Mechanical movements you can see working. Each watch has its own stock number: quote it when you enquire."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {watches.map((w, i) => (
            <WatchCard key={w.id} watch={w} priority={i === 0} />
          ))}
        </div>
      </section>
    </>
  );
}
