"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

interface DiamondZoomViewerProps {
  primaryImage: string;
  sheetImage: string;
  alt: string;
  initialView?: "sheet" | "face";
  aspectRatioClass?: string;
}

// Mouse and trackpad users hover to zoom; touch screens (no hover) tap to zoom instead.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const subscribeHover = (cb: () => void) => {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const canHoverNow = () => window.matchMedia(HOVER_QUERY).matches;

const ZOOM = 2.5;

export default function DiamondZoomViewer({
  primaryImage,
  sheetImage,
  alt,
  initialView = "sheet",
  aspectRatioClass = "aspect-[3/2]",
}: DiamondZoomViewerProps) {
  const [activeView, setActiveView] = useState<"sheet" | "face">(initialView);
  const [isZoomed, setIsZoomed] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const frame = useRef<HTMLButtonElement>(null);
  const canHover = useSyncExternalStore(subscribeHover, canHoverNow, () => true);

  const currentImage = activeView === "sheet" ? sheetImage : primaryImage;

  const pointTo = useCallback((clientX: number, clientY: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    });
  }, []);

  const reset = () => {
    setIsZoomed(false);
    setCoords({ x: 50, y: 50 });
  };

  const tab = (view: "sheet" | "face", label: string) => (
    <button
      type="button"
      onClick={() => {
        setActiveView(view);
        reset();
      }}
      aria-pressed={activeView === view}
      className={`cursor-pointer px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-all ${
        activeView === view
          ? "bg-navy font-medium text-white shadow-xs"
          : "border border-mist bg-white text-slate hover:border-royal/50 hover:text-navy"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 border-b border-mist/70 pb-3">
        {tab("sheet", "4-angle sheet")}
        {tab("face", "Face-up view")}
      </div>

      {/* One button: hover (mouse) or tap (touch) zooms, and Enter/Space works from the keyboard. */}
      <button
        ref={frame}
        type="button"
        aria-pressed={isZoomed}
        aria-label={isZoomed ? "Zoom out of the diamond photo" : "Zoom in on the diamond photo"}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") {
            setIsZoomed(true);
            pointTo(e.clientX, e.clientY);
          }
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") pointTo(e.clientX, e.clientY);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") reset();
        }}
        onClick={(e) => {
          // Mouse zoom is driven by hover; a click only matters for touch and keyboard.
          if (canHover && e.detail > 0) return;
          if (isZoomed) reset();
          else {
            setIsZoomed(true);
            if (e.detail > 0) pointTo(e.clientX, e.clientY);
          }
        }}
        className={`relative block ${aspectRatioClass} w-full overflow-hidden border border-mist bg-white shadow-xs ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        } select-none focus-visible:outline-2 focus-visible:outline-royal`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,248,252,0.8),transparent_70%)]" />
        <div
          className="relative h-full w-full will-change-transform transition-transform duration-150 ease-out"
          style={{ transform: isZoomed ? `scale(${ZOOM})` : "scale(1)", transformOrigin: `${coords.x}% ${coords.y}%` }}
        >
          <Image
            src={currentImage}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 640px, (min-width: 768px) 50vw, 100vw"
            className="pointer-events-none object-contain p-2"
            priority
          />
        </div>
      </button>

      {/* Hint sits below the photo, so it never covers the stone. */}
      <p className="text-center font-mono text-[11px] uppercase tracking-wider text-slate" aria-live="polite">
        {canHover
          ? isZoomed
            ? `${ZOOM}× zoom · move to inspect`
            : "Hover the photo to zoom in"
          : isZoomed
            ? "Tap the photo to zoom out"
            : "Tap the photo to zoom in"}
      </p>
    </div>
  );
}
