"use client";

import { useState } from "react";
import Image from "next/image";
import type { WatchMedia } from "@/data/watches";

// Main viewer plus a thumbnail strip. A video item plays inline with controls; it only loads when chosen.
export default function WatchGallery({ media }: { media: WatchMedia[] }) {
  const [index, setIndex] = useState(0);
  const current = media[index];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden border border-mist/80 bg-gradient-to-b from-white via-ice/20 to-[#f2f6fc]">
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={current.alt}
            className="h-full w-full bg-black object-contain"
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority={index === 0}
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-contain p-4"
          />
        )}
      </div>

      {media.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
          {media.map((m, i) => (
            <li key={`${m.type}-${m.src}`}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={m.type === "video" ? "Play video" : `Show image ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-square w-full cursor-pointer overflow-hidden border bg-white transition-colors ${
                  i === index ? "border-royal" : "border-mist hover:border-royal/50"
                }`}
              >
                <Image
                  src={m.type === "video" ? m.poster : m.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {m.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-navy/35" aria-hidden>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[10px] text-navy">▶</span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
