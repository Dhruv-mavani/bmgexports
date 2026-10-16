import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { diamonds, getDiamond } from "@/data/diamonds";

export function generateStaticParams() {
  return diamonds.map((d) => ({ id: d.id }));
}

export async function generateMetadata(props: PageProps<"/collection/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const d = getDiamond(id);
  return { title: d ? `${d.carat.toFixed(2)} ct ${d.shape}` : "Not found" };
}

export default async function DiamondPage(props: PageProps<"/collection/[id]">) {
  const { id } = await props.params;
  const d = getDiamond(id);
  if (!d) notFound();

  const specs = [
    ["Shape", d.shape],
    ["Carat", d.carat.toFixed(2)],
    ["Colour", d.color],
    ["Clarity", d.clarity],
    ["Cut", d.cut],
    ["Certificate", d.certificate],
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <Link href="/collection" className="text-sm text-slate hover:text-royal">← Back to collection</Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="border border-mist">
          <Image src={d.sheet} alt={`${d.shape} cut blue diamond — up, down, side and angled views`} width={1536} height={1024} sizes="(min-width: 768px) 560px, 100vw" className="w-full" priority />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-royal">{d.certificate} Certified</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{d.carat.toFixed(2)} ct {d.shape}</h1>
          <dl className="mt-10 divide-y divide-mist border-y border-mist">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 text-sm">
                <dt className="text-slate">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/contact?stone=${d.id}`}
            className="mt-10 inline-block bg-navy px-6 py-3 text-xs sm:px-8 sm:text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-royal"
          >
            Enquire about this stone
          </Link>
        </div>
      </div>
    </section>
  );
}
