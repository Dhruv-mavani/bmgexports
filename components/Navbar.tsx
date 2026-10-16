"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-white/90 backdrop-blur">
      {/* Fixed 64px bar (+1px border): the home-page scroll scene positions itself against this height. */}
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" aria-label="BGM Exports home" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="BGM Exports" width={1037} height={366} className="h-8 w-auto sm:h-10" priority />
        </Link>

        <ul className="hidden items-center gap-8 text-sm tracking-wide text-navy sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-royal">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-navy sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3.5 w-6" aria-hidden>
            <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-px w-6 bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-mist bg-white px-4 py-2 sm:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-serif text-2xl text-navy transition-colors hover:text-royal"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
