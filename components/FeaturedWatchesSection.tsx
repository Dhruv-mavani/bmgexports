import Link from "next/link";
import type { Watch } from "@/data/watches";
import WatchCard from "./WatchCard";

export default function FeaturedWatchesSection({ watches }: { watches: Watch[] }) {
  return (
    <section className="border-b border-mist/70 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 border border-mist/80 bg-white/80 px-3.5 py-1 text-[10px] uppercase tracking-[0.3em] text-royal shadow-2xs backdrop-blur-xs">
            <span className="text-[7px]">◆</span>
            <span>Watches</span>
            <span className="text-[7px]">◆</span>
          </div>
          <h2 className="mt-4 font-serif text-3xl font-normal tracking-tight text-navy sm:text-4xl lg:text-5xl">Automatic Skeleton Watches</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate sm:text-base">
            Mechanical movements you can see working, with a transparent case back and a silicone strap.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 text-mist" aria-hidden>
            <span className="h-px w-12 bg-mist" />
            <span className="text-xs text-royal">◆</span>
            <span className="h-px w-12 bg-mist" />
          </div>
        </header>

        <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
          {watches.map((w) => (
            <WatchCard key={w.id} watch={w} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/watches" className="text-sm uppercase tracking-[0.2em] text-royal hover:underline">
            View all watches →
          </Link>
        </div>
      </div>
    </section>
  );
}
