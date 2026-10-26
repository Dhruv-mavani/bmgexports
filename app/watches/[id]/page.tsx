import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import WatchGallery from "@/components/WatchGallery";
import { discountPercent, fmtPrice, getWatch, watchCode, watchPath, watches } from "@/data/watches";
import { abs, SITE } from "@/lib/site";

export function generateStaticParams() {
  return watches.map((w) => ({ id: w.id }));
}

export async function generateMetadata(props: PageProps<"/watches/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const w = getWatch(id);
  if (!w) return { title: "Watch not found", robots: { index: false } };
  const description = `${w.name} (${watchCode(w)}): ${w.summary} Enquire with ${SITE.name} for availability.`;
  return {
    title: `${w.name} · ${watchCode(w)}`,
    description,
    alternates: { canonical: watchPath(w) },
    openGraph: { type: "website", title: w.name, description, images: [{ url: w.media[0].src, width: 1080, height: 1080, alt: w.name }] },
    twitter: { card: "summary_large_image", title: w.name, description, images: [w.media[0].src] },
  };
}

// Awaiting params here (not inside <Suspense>) lets Next answer an unknown watch with a real 404 status.
export default async function WatchPage(props: PageProps<"/watches/[id]">) {
  const { id } = await props.params;
  const w = getWatch(id);
  if (!w) notFound();

  const code = watchCode(w);
  const specs = [["Stock number", code], ...w.specs];
  const video = w.media.find((m) => m.type === "video");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "@id": `${abs(watchPath(w))}#product`,
              name: w.name,
              description: w.description,
              sku: code,
              category: "Watch",
              image: w.media.filter((m) => m.type === "image").map((m) => abs(m.src)),
              url: abs(watchPath(w)),
              brand: { "@type": "Brand", name: SITE.name },
              offers: {
                "@type": "Offer",
                url: abs(watchPath(w)),
                priceCurrency: "INR",
                price: w.price,
                availability: "https://schema.org/InStock",
                itemCondition: "https://schema.org/NewCondition",
              },
              additionalProperty: w.specs.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
            },
            ...(video
              ? [
                  {
                    "@type": "VideoObject",
                    name: `${w.name} video`,
                    description: w.summary,
                    contentUrl: abs(video.src),
                    thumbnailUrl: abs(video.type === "video" ? video.poster : w.media[0].src),
                    uploadDate: "2026-10-26",
                  },
                ]
              : []),
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Watches", item: abs("/watches") },
                { "@type": "ListItem", position: 3, name: w.name, item: abs(watchPath(w)) },
              ],
            },
          ],
        }}
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-mist/80 pb-5">
          <Link
            href="/watches"
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
            <span>All watches</span>
          </Link>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-slate sm:block" aria-current="page">
            <span className="text-royal">/</span> <span className="font-semibold text-navy">{code}</span>
          </p>
        </nav>

        <div className="grid gap-12 md:grid-cols-2">
          <WatchGallery media={w.media} />

          <div className="flex flex-col justify-between border border-mist/80 bg-white p-6 shadow-xs sm:p-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-royal">
                Stock no. <span className="whitespace-nowrap">{code}</span>
              </p>
              <h1 className="mt-2 font-serif text-3xl font-normal leading-tight text-navy sm:text-4xl">{w.name}</h1>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
                <span className="font-serif text-3xl text-navy">{fmtPrice(w.price)}</span>
                <span className="text-sm text-slate/70 line-through">{fmtPrice(w.mrp)}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-royal">{discountPercent(w)}% off</span>
              </p>
              <p className="mt-5 text-sm leading-relaxed text-slate">{w.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate">
                {w.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5">
                    <span className="mt-1.5 text-[7px] text-royal" aria-hidden>
                      ◆
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-8 divide-y divide-mist/70 border border-mist/80 bg-white">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-ice/40">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-slate">{k}</dt>
                    <dd className="text-right font-serif text-base font-medium text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 border-t border-mist/70 pt-6">
              <Link
                href={`/contact?stone=${encodeURIComponent(code)}`}
                className="block w-full bg-navy px-6 py-3.5 text-center text-xs uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-royal hover:shadow-md sm:text-sm"
              >
                Enquire about this watch →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
