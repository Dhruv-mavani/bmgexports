import type { NextConfig } from "next";
import { diamonds, stonePath } from "./data/diamonds";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Old stone links keep working. Every earlier ID of a stone (BGM-001, BMG-001, BMG-RAD-0001 ...) redirects
  // permanently to the canonical /collection/<shape>/<stock number>, both as a bare /collection/<id> and in the
  // /collection/<shape>/<id> form that was live before. Generated from the data, so adding a stone needs no edit.
  async redirects() {
    return diamonds.flatMap((d) => [
      { source: `/collection/${d.id}`, destination: stonePath(d), permanent: true },
      ...(d.legacyIds ?? []).flatMap((old) => [
        { source: `/collection/${old}`, destination: stonePath(d), permanent: true },
        { source: `/collection/:shape/${old}`, destination: stonePath(d), permanent: true },
      ]),
    ]);
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
