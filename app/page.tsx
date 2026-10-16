import Link from "next/link";
import DiamondCard from "@/components/DiamondCard";
import ExplodeSection from "@/components/explode/ExplodeSection";
import SectionHeading from "@/components/SectionHeading";
import { diamonds } from "@/data/diamonds";

const trust = [
  { title: "Certified", text: "Every stone graded by GIA or IGI." },
  { title: "Ethically sourced", text: "Conflict-free, fully traceable supply." },
  { title: "Worldwide", text: "Insured shipping to buyers across the globe." },
];

export default function Home() {
  const featured = diamonds.filter((d) => d.featured);

  return (
    <>
      <ExplodeSection />

      <section className="border-b border-mist">
        <ul className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 py-12 text-center sm:grid-cols-3">
          {trust.map((t) => (
            <li key={t.title}>
              <p className="font-serif text-2xl">{t.title}</p>
              <p className="mt-1 text-sm text-slate">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <SectionHeading eyebrow="Featured" title="Selected stones" intro="A glimpse of our current inventory." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <DiamondCard key={d.id} diamond={d} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/collection" className="text-sm uppercase tracking-[0.2em] text-royal hover:underline">
            See all stones →
          </Link>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">Looking for a specific stone?</h2>
          <p className="mt-4 text-mist">Tell us what you need and we will source it for you.</p>
          <Link href="/contact" className="mt-8 inline-block bg-white px-6 py-3 text-xs sm:px-8 sm:text-sm uppercase tracking-[0.2em] text-navy transition-colors hover:bg-mist">
            Send an enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
