import type { MetadataRoute } from "next";
import { certificationPath, certifications, diamonds, diamondsByCertification, shapePath, shapes, stonePath } from "@/data/diamonds";
import { abs } from "@/lib/site";

// Update when content changes meaningfully (kept static so the sitemap is fully prerendered).
const LAST_MODIFIED = "2026-10-16";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/collection", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/faq", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];

  return [
    ...pages.map((p) => ({ url: abs(p.path), lastModified: LAST_MODIFIED, changeFrequency: "monthly" as const, priority: p.priority })),
    ...certifications
      .filter((c) => diamondsByCertification(c).length > 0)
      .map((c) => ({ url: abs(certificationPath(c)), lastModified: LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.85 })),
    ...shapes.map((s) => ({
      url: abs(shapePath(s)),
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...diamonds.map((d) => ({
      url: abs(stonePath(d)),
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
