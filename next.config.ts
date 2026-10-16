import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // The company name was originally spelled "BGM"; keep any old stone links working.
  async redirects() {
    return [{ source: "/collection/bgm-:n", destination: "/collection/bmg-:n", permanent: true }];
  },
  partialPrefetching: true,
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
