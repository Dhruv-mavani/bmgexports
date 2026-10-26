"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CONTACT, SITE } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/watches", label: "Watches" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-mist/80 bg-white sm:bg-white/92 sm:backdrop-blur-xl shadow-[0_4px_30px_rgba(15,42,82,0.03)] transition-colors duration-300">
      {/* Top ambient luxury light reflection */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-royal/40 to-transparent"
        aria-hidden
      />

      {/* Fixed 64px bar (+1px border): the home-page scroll scene positions itself against this height. */}
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        {/* Brand Logo & Provenance */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label={`${SITE.name} home`}
            onClick={() => setOpen(false)}
            className="group flex items-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/logo.png"
              alt={SITE.name}
              width={1072}
              height={385}
              className="h-8 w-auto sm:h-9 object-contain"
              priority
            />
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 border-l border-mist/80 pl-4 text-[9px] uppercase tracking-[0.25em] text-slate/80 font-mono">
            <span className="text-[6px] text-royal">◆</span> Lab-Grown Diamonds
          </span>
        </div>

        {/* Desktop Navigation Links & Action */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-navy">
            {links.map((l) => {
              const isActive = l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`group relative py-2 transition-colors duration-300 flex flex-col items-center ${
                      isActive
                        ? "text-royal font-semibold"
                        : "text-navy hover:text-royal"
                    }`}
                  >
                    <span>{l.label}</span>
                    {/* Active diamond dot */}
                    {isActive ? (
                      <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-royal" />
                    ) : (
                      <span className="absolute -bottom-1 h-[1.5px] w-0 bg-royal/70 transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Luxury Enquiry Button */}
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 border border-navy/90 bg-navy px-4.5 py-2 text-[10px] uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-royal hover:border-royal hover:shadow-[0_4px_18px_rgba(31,79,216,0.25)]"
          >
            <span className="text-[7px] text-mist transition-transform duration-300 group-hover:rotate-45" aria-hidden>
              ◆
            </span>
            <span>Enquire</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-navy md:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3.5 w-6" aria-hidden>
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-px w-6 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-mist/80 bg-white px-6 py-6 md:hidden shadow-xl animate-fade-in"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-royal font-mono mb-4 flex items-center gap-1.5">
            <span className="text-[7px]">◆</span> Navigation Menu
          </p>

          <ul className="divide-y divide-mist/70">
            {links.map((l, idx) => {
              const isActive = l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3.5 transition-colors group"
                  >
                    <span
                      className={`font-serif text-2xl transition-colors ${
                        isActive ? "text-royal font-normal" : "text-navy group-hover:text-royal"
                      }`}
                    >
                      {l.label}
                    </span>
                    <span className="font-mono text-xs text-slate/60 group-hover:text-royal transition-colors">
                      0{idx + 1} →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-4 border-t border-mist/80">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block w-full bg-navy py-3 px-4 text-center text-xs uppercase tracking-[0.25em] text-white transition-colors hover:bg-royal"
            >
              Send an enquiry
            </Link>
            <p className="mt-3 text-center text-[11px] text-slate font-mono">
              {CONTACT.email}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
