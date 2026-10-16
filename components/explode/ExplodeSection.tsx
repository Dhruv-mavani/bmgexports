"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { markSiteReady } from "@/lib/siteReady";
import { partNames, stageAt, stages } from "./stages";

const DiamondScene = dynamic(() => import("./DiamondScene"), { ssr: false });

const NAV_HEIGHT = 65; // sticky navbar, px

function Cta() {
  return (
    <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
      <Link href="/collection" className="bg-navy px-6 py-3 text-xs uppercase tracking-[0.2em] text-white sm:px-8 sm:text-sm transition-colors hover:bg-royal">
        View collection
      </Link>
      <Link href="/contact" className="border border-navy px-6 py-3 text-xs uppercase tracking-[0.2em] text-navy sm:px-8 sm:text-sm transition-colors hover:border-royal hover:text-royal">
        Enquire
      </Link>
    </div>
  );
}

export default function ExplodeSection() {
  const wrapper = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const [stage, setStage] = useState(0);
  const bar = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => {
    setReady(true);
    markSiteReady();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(mq.matches);
      if (mq.matches) markSiteReady(); // no 3D scene to wait for
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el || reduced) return;

    let raf = 0;
    // Progress is computed synchronously on every scroll event (cheap) so the 3D scene always reads
    // the latest value; React state is only touched once per frame, and only when the stage changes.
    const compute = () => {
      const rect = el.getBoundingClientRect();
      // Use the pinned box's own (svh-based) height, not window.innerHeight: on phones innerHeight changes
      // as the address bar collapses, which would make progress jump mid-scroll.
      const travel = rect.height - (pin.current?.offsetHeight ?? window.innerHeight - NAV_HEIGHT);
      const p = Math.min(1, Math.max(0, (NAV_HEIGHT - rect.top) / travel));
      progress.current = p;
      if (bar.current) bar.current.style.height = `${p * 100}%`;
    };
    const update = () => {
      raf = 0;
      setStage(stageAt(progress.current));
    };
    const onScroll = () => {
      compute();
      if (!raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className="border-y border-mist bg-ice">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 py-24 md:grid-cols-2">
          <Image src="/images/oval-sheet.jpg" alt="Blue diamond shown from four angles" width={1536} height={1024} sizes="(min-width: 768px) 560px, 100vw" className="w-full border border-mist" />
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-royal">{stages[0].eyebrow}</p>
            <h1 className="mt-3 font-serif text-4xl text-navy sm:text-5xl lg:text-6xl">{stages[0].title}</h1>
            <p className="mt-4 max-w-md text-slate">{stages[0].body}</p>
            <Cta />
          </div>
          <ol className="space-y-6">
            {stages.slice(1, -1).map((s) => (
              <li key={s.title}>
                <p className="font-serif text-2xl">{s.title}</p>
                <p className="text-sm text-slate">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapper} className="relative h-[500vh] border-b border-mist bg-gradient-to-b from-ice via-white to-white" aria-label="Anatomy of a diamond">
      {/* The pinned scene only shows one stage at a time. This keeps the whole story (and the page's
          single <h1>) in the document for search engines, screen readers and AI agents. */}
      <div className="sr-only">
        <h1>BGM Exports: {stages[0].title}</h1>
        <p>{stages[0].body}</p>
        <h2>Anatomy of a diamond</h2>
        <ol>
          {stages.slice(1, -1).map((s) => (
            <li key={s.title}>
              <strong>{s.title}.</strong> {s.body}
            </li>
          ))}
        </ol>
        <p>{stages[stages.length - 1].body}</p>
      </div>
      <div
        ref={pin}
        className="sticky top-[65px] mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] grid-rows-[1fr_auto] px-4 sm:px-6 md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-8"
        style={{ height: `calc(100svh - ${NAV_HEIGHT}px)` }}
      >
        <div className="relative min-h-0 md:order-2 md:h-[80%]">
          <div className={`h-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
            <DiamondScene progress={progress} labels={labels} active={inView} onReady={onReady} />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {partNames.map((name, i) => (
              <div
                key={name}
                ref={(el) => void (labels.current[i] = el)}
                className="absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap opacity-0 md:gap-2"
              >
                <span className="h-px w-3 bg-royal md:w-5" />
                <span className="text-[10px] uppercase tracking-[0.12em] text-navy md:text-[11px] md:tracking-[0.18em]">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Every stage's text sits in the same grid cell, so the panel is always as tall as the tallest
            stage. The canvas next to it therefore never changes size while scrolling (no jumping). */}
        <div className="grid pb-6 md:order-1 md:pb-0" aria-live="polite">
          {stages.map((st, i) => (
            <div
              key={st.title}
              inert={i !== stage}
              aria-hidden={i !== stage}
              // Outgoing text leaves fast; incoming text waits a beat, so two stages never overlap.
              className={`col-start-1 row-start-1 transition-[opacity,transform] ease-out ${
                i === stage ? "translate-y-0 opacity-100 delay-150 duration-300" : "pointer-events-none translate-y-3 opacity-0 duration-150"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-royal">{st.eyebrow}</p>
              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-navy sm:text-5xl lg:text-6xl">{st.title}</h2>
              <p className="mt-3 max-w-md text-sm text-slate sm:mt-4 sm:text-base">{st.body}</p>
              {st.cta && <Cta />}
            </div>
          ))}
        </div>

        <div className="absolute inset-y-[15%] right-3 hidden w-px bg-mist md:block" aria-hidden>
          <div ref={bar} className="w-px bg-royal" style={{ height: 0 }} />
        </div>
      </div>
    </section>
  );
}
