import type { Metadata } from "next";
import Link from "next/link";
import CollectionTabs from "@/components/CollectionTabs";
import DiamondCard from "@/components/DiamondCard";
import JsonLd from "@/components/JsonLd";
import LabGrownNotice from "@/components/LabGrownNotice";
import SectionHeading from "@/components/SectionHeading";
import { certificationPath, certificationTitle, diamondsByCertification, shapePath, shapes, stoneCode, stoneName, stonePath, type Certification } from "@/data/diamonds";
import { abs, SITE } from "@/lib/site";

export function certificationMetadata(c: Certification): Metadata {
  const n = diamondsByCertification(c).length;
  const title = `${certificationTitle[c]} Diamonds`;
  const description =
    n === 0
      ? `${certificationTitle[c]} diamonds from ${SITE.name}. None are listed at the moment: ask us in an enquiry about ${c} stones.`
      : c === "non-certified"
        ? `Browse ${n} non-certified ${n === 1 ? "diamond" : "diamonds"} from ${SITE.name}, sold without a grading report. See carat, clarity and origin, then enquire about any stone.`
        : `Browse ${n} certified ${n === 1 ? "diamond" : "diamonds"} from ${SITE.name}. See carat, clarity, the grading lab and report, then enquire about any stone.`;
  return {
    title,
    description,
    alternates: { canonical: certificationPath(c) },
    openGraph: { type: "website", title: `${title} · ${SITE.name}`, description },
    // An empty list is thin content: keep it out of search until it has stones.
    robots: n === 0 ? { index: false, follow: true } : undefined,
  };
}

export default function CertificationListing({ certification }: { certification: Certification }) {
  const stones = diamondsByCertification(certification);
  const title = certificationTitle[certification];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: `${title} diamonds`,
              url: abs(certificationPath(certification)),
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
                { "@type": "ListItem", position: 3, name: `${title} diamonds`, item: abs(certificationPath(certification)) },
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
            title={`${title} diamonds`}
            intro={stones.length ? `${stones.length} ${stones.length === 1 ? "stone" : "stones"} currently listed.` : `No ${certification} stones are listed yet.`}
          />

          <div className="mt-10">
            <CollectionTabs current={certification} />
          </div>
          <LabGrownNotice className="mx-auto mt-8 max-w-3xl" />

          {stones.length > 0 ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {stones.map((d, i) => (
                <DiamondCard key={d.id} diamond={d} priority={i === 0} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-2xl border border-mist bg-ice/40 p-8 text-center sm:p-12">
              <span className="mb-2 inline-block text-base text-royal" aria-hidden>
                ◆
              </span>
              <p className="font-serif text-2xl text-navy">No {certification} stones listed yet</p>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Every stone we currently list is {certification === "certified" ? "non-certified" : "certified"}. If you are looking for a {certification} stone,
                tell us what you need and we will let you know what is possible.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact" className="bg-navy px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-royal">
                  Send an enquiry
                </Link>
                <Link
                  href="/collection"
                  className="border border-navy px-6 py-3 text-xs uppercase tracking-[0.2em] text-navy transition-colors hover:border-royal hover:text-royal"
                >
                  View all stones
                </Link>
              </div>
            </div>
          )}

          <nav aria-label="Browse by shape" className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-mist/80 pt-8">
            <span className="w-full text-center text-[11px] uppercase tracking-[0.25em] text-slate sm:w-auto">Browse by shape</span>
            {shapes.map((s) => (
              <Link key={s} href={shapePath(s)} className="font-serif text-xl text-navy underline decoration-mist underline-offset-4 transition-colors hover:text-royal hover:decoration-royal">
                {s}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
