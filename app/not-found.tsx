import type { Metadata } from "next";
import Link from "next/link";
import { shapePath, shapes } from "@/data/diamonds";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist. Head back to the BMG Exports home page or browse the collection.",
  robots: { index: false, follow: true },
};

// Shown for any unknown URL, and whenever a stone or shape page doesn't exist.
export default function NotFound() {
  const links = [
    ...shapes.map((s) => ({ href: shapePath(s), label: `${s} diamonds` })),
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(220,232,250,0.65),transparent_70%)]"
        aria-hidden
      />

      <div className="mx-auto flex min-h-[calc(100svh-65px)] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="inline-flex items-center gap-2 border border-mist/80 bg-white/80 px-3.5 py-1 text-[10px] uppercase tracking-[0.3em] text-royal shadow-2xs">
          <span className="text-[7px]" aria-hidden>
            ◆
          </span>
          Error 404
          <span className="text-[7px]" aria-hidden>
            ◆
          </span>
        </p>

        {/* A cut diamond that has lost a facet: the 404 sits where it should be. */}
        <div className="relative mt-8 flex items-center justify-center" aria-hidden>
          <svg viewBox="0 0 120 100" className="h-32 w-auto text-royal sm:h-40" fill="none" stroke="currentColor" strokeLinejoin="round">
            <path d="M30 6h60l26 34-56 58L4 40z" strokeWidth="1.4" className="fill-ice/60" />
            <path d="M4 40h112M44 40l16 58 16-58M44 40L30 6M76 40L90 6M44 40l16-34 16 34" strokeWidth="1" opacity="0.55" />
          </svg>
          <span className="absolute font-serif text-5xl text-navy sm:text-6xl">404</span>
        </div>

        <h1 className="mt-8 font-serif text-3xl font-normal leading-tight text-navy sm:text-4xl lg:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate sm:text-base">
          The link may be old, or the address mistyped. If you were looking for a particular stone, quote its stock number (for example
          BMG-RAD-0001) and we&apos;ll find it for you.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="bg-navy px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-royal hover:shadow-md sm:px-8 sm:text-sm"
          >
            Back to home
          </Link>
          <Link
            href="/collection"
            className="border border-navy px-6 py-3 text-xs uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:border-royal hover:bg-ice/50 hover:text-royal sm:px-8 sm:text-sm"
          >
            View collection
          </Link>
        </div>

        <nav aria-label="Helpful pages" className="mt-12 w-full border-t border-mist/80 pt-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate">Or try one of these</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-serif text-xl text-navy underline decoration-mist underline-offset-4 transition-colors hover:text-royal hover:decoration-royal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
