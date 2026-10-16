import type { Metadata } from "next";
import FilterableGrid from "@/components/FilterableGrid";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = { title: "Collection" };

export default function CollectionPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <SectionHeading eyebrow="Collection" title="Certified diamonds" intro="Filter by shape and size to find your stone." />
      <div className="mt-12">
        <FilterableGrid />
      </div>
    </section>
  );
}
