import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
