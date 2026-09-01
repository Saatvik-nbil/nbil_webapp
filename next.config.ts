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
  // Baseline hardening headers on every response. No inline CSP here yet —
  // the animation stack (GSAP/Motion/inline JSON-LD `<script>` tags) hasn't
  // been audited for nonce compatibility, so start with the headers that are
  // safe to add without touching markup.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // No legitimate reason for this site to be framed by another origin.
          { key: "X-Frame-Options", value: "DENY" },
          // Belt-and-braces alongside X-Frame-Options for browsers that honor CSP.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
