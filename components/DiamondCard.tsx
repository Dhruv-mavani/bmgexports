import Image from "next/image";
import Link from "next/link";
import type { Diamond } from "@/data/diamonds";

export default function DiamondCard({ diamond }: { diamond: Diamond }) {
  return (
    <Link
      href={`/collection/${diamond.id}`}
      className="group block border border-mist bg-white transition-colors hover:border-royal"
    >
      <div className="overflow-hidden bg-white">
        <Image
          src={diamond.image}
          alt={`${diamond.shape} cut blue diamond`}
          width={768}
          height={384}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[2/1] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="border-t border-mist p-5">
        <p className="font-serif text-2xl text-navy">
          {diamond.carat.toFixed(2)} ct {diamond.shape}
        </p>
        <p className="mt-1 text-sm text-slate">
          {diamond.color} · {diamond.clarity} · {diamond.cut}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-royal">{diamond.certificate} Certified</p>
      </div>
    </Link>
  );
}
