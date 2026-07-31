import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-93fb1ea76bd44cf5a087521d14096abd.r2.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.aleeviacarterresidences.com",
      },
      // This site's own canonical host. Post images should normally be written as
      // root-relative `/assets/…` paths, which are read from disk and need no
      // entry here at all. This exists so a cover pasted as a full URL to our own
      // assets still renders instead of silently falling back.
      {
        protocol: "https",
        hostname: "www.aleeviacarterresidences.com",
      },
    ],
  },
};

export default nextConfig;
