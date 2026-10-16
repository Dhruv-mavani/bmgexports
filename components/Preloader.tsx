"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSiteReady } from "@/lib/siteReady";

const MIN_MS = 1400; // never flash: show the logo at least this long
const CAP_MS = 15000; // never hang: give up waiting for the 3D scene after this long

export default function Preloader() {
  const pathname = usePathname();
  const sceneReady = useSiteReady();
  const [minDone, setMinDone] = useState(false);
  const [capDone, setCapDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setMinDone(true), MIN_MS);
    const b = setTimeout(() => setCapDone(true), CAP_MS);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  // Only the home page has a 3D scene to wait for.
  const done = minDone && (pathname !== "/" || sceneReady || capDone);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setGone(true), 800);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [done]);

  if (gone) return null;

  return (
    <div
      id="preloader"
      aria-hidden={done}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-navy transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="relative flex items-center justify-center">
        <div className="preloader-glow absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(74,140,255,0.7)_0%,rgba(31,79,216,0.35)_40%,transparent_70%)] blur-2xl sm:h-[28rem] sm:w-[28rem]" />
        <Image
          src="/images/logo.png"
          alt="BMG Exports"
          width={1072}
          height={385}
          priority
          className="preloader-logo relative w-44 [filter:brightness(0)_invert(1)] sm:w-72"
        />
      </div>
    </div>
  );
}
