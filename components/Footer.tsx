import Image from "next/image";
import Link from "next/link";
import { disclosureText } from "@/data/diamonds";
import { CONTACT, SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/watches", label: "Watches" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

// One loop segment of the background text. The track holds two identical segments and slides by exactly
// half its width, so the loop is seamless at any screen size.
function Segment({ outline = false }: { outline?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <span
          key={i}
          className={`flex shrink-0 items-center whitespace-nowrap font-serif text-[clamp(4rem,17vw,11rem)] uppercase leading-[0.95] tracking-[0.04em] ${
            outline ? "text-transparent [-webkit-text-stroke:1px_rgba(156,196,255,0.28)]" : "text-white/[0.07]"
          }`}
        >
          {SITE.name}
          <span className="mx-[0.35em] text-[0.4em] text-royal/60">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-navy text-white/75">
      {/* Decorative moving company name, kept behind the content. */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex select-none flex-col justify-center gap-2 overflow-hidden sm:gap-4" aria-hidden>
        <div className="marquee-track marquee-left flex w-max">
          <Segment />
          <Segment />
        </div>
        <div className="marquee-track marquee-right flex w-max">
          <Segment outline />
          <Segment outline />
        </div>
        <div className="marquee-track marquee-left flex w-max">
          <Segment />
          <Segment />
        </div>
      </div>
      {/* Soft glow + fade so text stays readable over the moving background. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(31,79,216,0.35),transparent_60%),linear-gradient(to_bottom,rgba(15,42,82,0.55),rgba(15,42,82,0.9))]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-10">
          <div>
            <Image src="/images/logo-white.png" alt={SITE.name} width={1072} height={385} className="h-14 w-auto sm:h-16" />
            <p className="mt-5 max-w-xs font-serif text-2xl leading-snug text-white sm:text-3xl">{SITE.tagline}</p>
            <p className="mt-3 max-w-xs text-sm text-white/65">Lab-grown diamonds, selected with care and delivered worldwide.</p>
            <Link
              href="/contact"
              className="mt-7 inline-block bg-white px-6 py-3 text-xs uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:bg-mist hover:shadow-lg hover:scale-[1.02] sm:px-8 sm:text-sm font-medium"
            >
              Send an enquiry
            </Link>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#9cc4ff]">Explore</h2>
            <ul className="mt-4 space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-serif text-2xl text-white/90 transition-colors hover:text-[#9cc4ff]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#9cc4ff]">Contact</h2>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-4 block break-words font-serif text-lg text-white transition-colors hover:text-[#9cc4ff] sm:text-xl lg:text-2xl"
            >
              {CONTACT.email}
            </a>
            <address className="mt-5 text-sm not-italic leading-relaxed text-white/70">
              {CONTACT.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
        </div>

        {disclosureText() && (
          <p className="mt-12 max-w-3xl text-xs leading-relaxed text-white/60 sm:mt-16">
            <span className="mr-1.5 font-medium uppercase tracking-[0.2em] text-[#9cc4ff]">◆ Disclosure</span>
            {disclosureText()}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/55 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p>© {SITE.name}. All rights reserved.</p>
          <p>Lab-grown diamonds, exported with integrity.</p>
        </div>
      </div>
    </footer>
  );
}
