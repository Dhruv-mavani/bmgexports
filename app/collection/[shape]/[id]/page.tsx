import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DiamondZoomViewer from "@/components/DiamondZoomViewer";
import JsonLd from "@/components/JsonLd";
import LabGrownNotice from "@/components/LabGrownNotice";
import {
  diamonds,
  fmtCarat,
  getDiamond,
  getShapeBySlug,
  shapePath,
  shapeSlug,
  certificationLabel,
  originLabel,
  stoneCode,
  stoneName,
  stonePath,
  stoneSummary,
} from "@/data/diamonds";
import { abs, SITE } from "@/lib/site";

export function generateStaticParams() {
  return diamonds.map((d) => ({ shape: shapeSlug(d.shape), id: d.id }));
}

// A stone is only valid at /collection/<its own shape>/<its stock number>.
function findStone(shape: string, id: string) {
  const d = getDiamond(id);
  return d && d.shape === getShapeBySlug(shape) ? d : undefined;
}

export async function generateMetadata(props: PageProps<"/collection/[shape]/[id]">): Promise<Metadata> {
  const { shape, id } = await props.params;
  const d = findStone(shape, id);
  if (!d) return { title: "Stone not found", robots: { index: false } };
  const name = `${stoneName(d)} Diamond`;
  const description = `${name} (${stoneCode(d)}): ${stoneSummary(d)}. Enquire with ${SITE.name} for availability and pricing.`;
  return {
    title: `${name} · ${stoneCode(d)}`,
    description,
    alternates: { canonical: stonePath(d) },
    openGraph: { type: "website", title: name, description, images: [{ url: d.sheet, width: 1536, height: 1024, alt: name }] },
    twitter: { card: "summary_large_image", title: name, description, images: [d.sheet] },
  };
}

// Awaiting params here (not inside <Suspense>) lets Next answer an unknown stone with a real 404 status.
export default async function DiamondPage(props: PageProps<"/collection/[shape]/[id]">) {
  const { shape, id } = await props.params;
  const d = findStone(shape, id);
  if (!d) notFound();

  const code = stoneCode(d);
  const name = `${stoneName(d)} Diamond`;
  const specs = [
    ["Stock number", code],
    ["Shape", d.shape],
    ["Carat", fmtCarat(d.carat)],
    ...(d.color ? [["Colour", d.color]] : []),
    ["Clarity", d.clarity],
    ...(d.cut ? [["Cut", d.cut]] : []),
    ...(originLabel(d) ? [["Origin", originLabel(d)!]] : []),
    ...(certificationLabel(d) ? [["Certification", certificationLabel(d)!]] : []),
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "@id": `${abs(stonePath(d))}#product`,
              name,
              description: `${name}, ${stoneSummary(d)}.`,
              sku: code,
              category: "Diamond",
              image: [abs(d.image), abs(d.sheet)],
              url: abs(stonePath(d)),
              brand: { "@type": "Brand", name: SITE.name },
              additionalProperty: [
                { "@type": "PropertyValue", name: "Shape", value: d.shape },
                { "@type": "PropertyValue", name: "Carat weight", value: d.carat, unitText: "ct" },
                ...(d.color ? [{ "@type": "PropertyValue", name: "Colour", value: d.color }] : []),
                { "@type": "PropertyValue", name: "Clarity", value: d.clarity },
                ...(d.cut ? [{ "@type": "PropertyValue", name: "Cut", value: d.cut }] : []),
                ...(d.labGrown ? [{ "@type": "PropertyValue", name: "Origin", value: `Lab-grown (${d.labGrown})` }] : []),
                ...(certificationLabel(d) ? [{ "@type": "PropertyValue", name: "Certification", value: certificationLabel(d) }] : []),
              ],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Collection", item: abs("/collection") },
                { "@type": "ListItem", position: 3, name: `${d.shape} diamonds`, item: abs(shapePath(d.shape)) },
                { "@type": "ListItem", position: 4, name, item: abs(stonePath(d)) },
              ],
            },
          ],
        }}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-mist/80 pb-5">
          <Link
            href={shapePath(d.shape)}
            className="group inline-flex items-center gap-2.5 border border-mist/80 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-navy shadow-2xs transition-all duration-300 hover:border-royal/60 hover:text-royal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-3.5 w-3.5 text-royal transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>{d.shape} diamonds</span>
          </Link>
          <ol className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate sm:flex">
            <li>
              <Link href="/collection" className="hover:text-royal">
                Collection
              </Link>
            </li>
            <li aria-hidden className="text-royal">
              /
            </li>
            <li>
              <Link href={shapePath(d.shape)} className="hover:text-royal">
                {d.shape}
              </Link>
            </li>
            <li aria-hidden className="text-royal">
              /
            </li>
            <li className="font-semibold text-navy" aria-current="page">
              {code}
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 md:grid-cols-2">
          <DiamondZoomViewer
            primaryImage={d.image}
            sheetImage={d.sheet}
            alt={`${d.shape} cut diamond — up, down, side and angled views`}
            initialView="sheet"
            aspectRatioClass="aspect-[3/2]"
          />
          <div className="flex flex-col justify-between border border-mist/80 bg-white p-6 shadow-xs sm:p-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-royal">
                Stock no. <span className="whitespace-nowrap">{code}</span>
              </p>
              <h1 className="mt-2 font-serif text-3xl font-normal leading-tight text-navy sm:text-4xl lg:text-5xl">{stoneName(d)}</h1>
              <p className="mt-1 text-xs tracking-wide text-slate sm:text-sm">
                {[d.color && `Colour ${d.color}`, `${d.clarity} clarity`].filter(Boolean).join(" · ")}
              </p>
              {(originLabel(d) || certificationLabel(d)) && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {originLabel(d) && (
                    <li className="border border-navy/40 bg-navy/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-navy">{originLabel(d)}</li>
                  )}
                  {certificationLabel(d) && (
                    <li className="border border-mist bg-ice px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-royal">{certificationLabel(d)}</li>
                  )}
                </ul>
              )}

              <dl className="mt-8 divide-y divide-mist/70 border border-mist/80 bg-white">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-ice/40">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-slate">{k}</dt>
                    <dd className="text-right font-serif text-base font-medium text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 space-y-4 border-t border-mist/70 pt-6">
              <LabGrownNotice />
              <Link
                href={`/contact?stone=${encodeURIComponent(code)}`}
                className="block w-full bg-navy px-6 py-3.5 text-center text-xs uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-royal hover:shadow-md sm:text-sm"
              >
                Enquire about this stone →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
