import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DiamondCard from "@/components/DiamondCard";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import { diamondsOfShape, getShapeBySlug, shapePath, shapes, shapeSlug, stoneCode, stoneName, stonePath } from "@/data/diamonds";
import { abs, SITE } from "@/lib/site";

export function generateStaticParams() {
  return shapes.map((s) => ({ shape: shapeSlug(s) }));
}

export async function generateMetadata(props: PageProps<"/collection/[shape]">): Promise<Metadata> {
  const { shape: slug } = await props.params;
  const shape = getShapeBySlug(slug);
  if (!shape) return { title: "Not found", robots: { index: false } };
  const n = diamondsOfShape(shape).length;
  const description = `Browse ${n} ${shape.toLowerCase()} cut ${n === 1 ? "diamond" : "diamonds"} from ${SITE.name}. See carat, colour and clarity, then enquire about any stone.`;
  return {
    title: `${shape} Cut Diamonds`,
    description,
    alternates: { canonical: shapePath(shape) },
    openGraph: { type: "website", title: `${shape} cut diamonds · ${SITE.name}`, description },
  };
}

// Awaiting params directly (not inside <Suspense>) lets an unknown shape return a real 404 status.
export default async function ShapePage(props: PageProps<"/collection/[shape]">) {
  const { shape: slug } = await props.params;
  const shape = getShapeBySlug(slug);
  if (!shape) notFound();

  const stones = diamondsOfShape(shape);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: `${shape} cut diamonds`,
              url: abs(shapePath(shape)),
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: stones.length,
                itemListElement: stones.map((d, i) => ({
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
                { "@type": "ListItem", position: 3, name: `${shape} diamonds`, item: abs(shapePath(shape)) },
              ],
            },
          ],
        }}
      />
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_10%,rgba(220,232,250,0.4),transparent_70%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            level={1}
            eyebrow="Collection"
            title={`${shape} diamonds`}
            intro={`${stones.length} ${shape.toLowerCase()} cut ${stones.length === 1 ? "stone" : "stones"} currently listed.`}
          />

          <nav aria-label="Browse by shape" className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              href="/collection"
              className="border border-mist bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate transition-colors hover:border-royal/50 hover:text-navy"
            >
              All stones
            </Link>
            {shapes.map((s) => (
              <Link
                key={s}
                href={shapePath(s)}
                aria-current={s === shape ? "page" : undefined}
                className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                  s === shape ? "bg-navy font-medium text-white" : "border border-mist bg-white text-slate hover:border-royal/50 hover:text-navy"
                }`}
              >
                {s}
              </Link>
            ))}
          </nav>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {stones.map((d, i) => (
              <DiamondCard key={d.id} diamond={d} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
