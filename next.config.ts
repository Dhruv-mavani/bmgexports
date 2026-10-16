import type { NextConfig } from "next";
import { diamonds, stonePath } from "./data/diamonds";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Old stone links keep working: the earlier BGM/BMG-001 style IDs, and the flat /collection/<id> form,
  // all redirect permanently to the canonical /collection/<shape>/<id> URL. Generated from the data.
  async redirects() {
    return diamonds.flatMap((d) =>
      [...(d.legacyIds ?? []), d.id].map((id) => ({ source: `/collection/${id}`, destination: stonePath(d), permanent: true })),
    );
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
