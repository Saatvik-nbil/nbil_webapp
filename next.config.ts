import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Disk on this machine is near-full; the webpack persistent pack cache
  // repeatedly overflows it (ENOSPC). Disable filesystem caching so dev/build
  // never writes .next/cache/webpack. Trades incremental rebuild speed for
  // not crashing on a full disk.
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
