import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Search engines and AI assistants are all welcome: being cited by them is the point.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/enquiry"] },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/api/enquiry"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
