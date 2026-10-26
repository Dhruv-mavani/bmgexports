import Image from "next/image";
import Link from "next/link";
import { discountPercent, fmtPrice, watchCode, watchPath, type Watch } from "@/data/watches";

export default function WatchCard({ watch, priority = false }: { watch: Watch; priority?: boolean }) {
  const cover = watch.media[0];
  return (
    <article className="group relative flex flex-col bg-white border border-mist transition-all duration-500 hover:border-royal/60 hover:shadow-[0_20px_40px_-15px_rgba(15,42,82,0.1)]">
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-white via-ice/20 to-[#f2f6fc]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,232,250,0.6),transparent_70%)]" />
        <Link href={watchPath(watch)} className="relative block h-full w-full" aria-label={`View ${watch.name}`}>
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-grow flex-col justify-between border-t border-mist/70 bg-white p-5">
        <Link href={watchPath(watch)} className="block">
          <h3 className="font-serif text-2xl leading-tight text-navy transition-colors group-hover:text-royal sm:text-[1.7rem]">{watch.name}</h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            <li className="border border-navy/40 bg-navy/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.15em] text-navy">Automatic</li>
            <li className="border border-mist bg-ice px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-royal">{watch.finish}</li>
          </ul>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
            <span className="font-serif text-xl text-navy">{fmtPrice(watch.price)}</span>
            <span className="text-xs text-slate/70 line-through">{fmtPrice(watch.mrp)}</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-royal">{discountPercent(watch)}% off</span>
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate/70">{watchCode(watch)}</p>
        </Link>

        <div className="mt-6 flex items-center justify-between border-t border-mist/50 pt-3">
          <Link
            href={watchPath(watch)}
            className="group/link inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-navy transition-colors group-hover:text-royal"
          >
            <span>Explore Watch</span>
            <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </Link>
          <Link
            href={`/contact?stone=${encodeURIComponent(watchCode(watch))}`}
            className="text-[11px] uppercase tracking-[0.18em] text-slate transition-colors hover:text-royal"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
