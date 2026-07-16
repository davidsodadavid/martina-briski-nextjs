import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained production build (server.js + traced node_modules) for VPS deploys
  output: "standalone",
  turbopack: {
    // A stray lockfile in a parent directory makes Next mis-detect the workspace root
    root: path.join(__dirname),
  },
  images: {
    // Let Next.js resize/optimize images served from R2 instead of the
    // browser downloading full-resolution originals for tiny thumbnails.
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
  experimental: {
    // A bit above the app's own upload limits (5MB images, 20MB PDFs —
    // enforced in src/lib/uploads.ts) so oversized uploads hit our friendly
    // error message instead of Next's raw "Body exceeded" crash page.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
