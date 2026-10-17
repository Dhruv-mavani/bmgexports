import Link from "next/link";
import { certificationPath, certificationTitle, certifications, diamonds, diamondsByCertification, type Certification } from "@/data/diamonds";

// "All / Certified / Non-certified" with live counts. A category with no stones yet is still shown (count 0).
export default function CollectionTabs({ current }: { current: "all" | Certification }) {
  const items = [
    { key: "all" as const, href: "/collection", label: "All stones", count: diamonds.length },
    ...certifications.map((c) => ({ key: c, href: certificationPath(c), label: certificationTitle[c], count: diamondsByCertification(c).length })),
  ];

  return (
    <nav aria-label="Browse by certification" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {items.map((it) => (
        <Link
          key={it.key}
          href={it.href}
          aria-current={current === it.key ? "page" : undefined}
          className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
            current === it.key ? "bg-navy font-medium text-white" : "border border-mist bg-white text-slate hover:border-royal/50 hover:text-navy"
          }`}
        >
          {it.label} <span className="ml-1 text-[10px] opacity-75">({it.count})</span>
        </Link>
      ))}
    </nav>
  );
}
