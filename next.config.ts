import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
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
  // The domain used to serve a WordPress site, and Google still has its URLs
  // indexed. Each one is permanently redirected to its closest page here, so
  // search rankings carry over instead of turning into 404s. The list is the
  // old site's full Yoast sitemap (post, page and author sitemaps) as of
  // Nov 2026. Next strips the trailing slash first, so "/x/" lands on "/x".
  async redirects() {
    const to = (destination: string, ...sources: string[]) =>
      sources.map((source) => ({ source, destination, permanent: true }));

    return [
      // Machines
      ...to("/trivima", "/trivima-bioprinter"),
      ...to("/machines/trivima-np", "/trivima-bioprinter/trivimanpbioprinter"),
      ...to("/machines/trivima-aura", "/trivima-bioprinter/trivima-aura"),
      ...to("/machines/trivima-pro", "/trivima-pro-bioprinter"),
      // Discontinued models: the range page is the nearest current match.
      ...to(
        "/trivima",
        "/trivima-basic-bioprinter",
        "/trivima-advanced-bioprinter",
        "/trivima-mini-bioprinter",
        "/trivima-mini-india-smallest-bioprinter",
      ),
      ...to("/trivima#compare", "/compare-bioprinters"),
      ...to("/dhee-slicer", "/niyantranam-software"),

      // Blog posts, which used to sit at the site root
      ...to("/blogs/interdisciplinary-stem-education", "/advancing-bioprinting-education"),
      ...to("/blogs/bioprinting-spheroids", "/bioprinting-spheroids"),
      ...to("/blogs/gelma-5-reasons", "/5-reasons-to-choose-gelma-for-bioprinting"),
      ...to("/blogs/bioprinting-101-glossary", "/bioprinting-101-glossary"),
      ...to(
        "/blogs/bioprinting-101-troubleshooting",
        "/bioprinting-101-troubleshooting-common-challenges-and-solutions",
      ),
      ...to("/blogs/trivima-mini-and-pm-modi", "/trivima-mini-and-prime-minister-modi"),
      ...to("/blogs/bioprinting-in-space", "/bioprinting-in-space-zero-g"),
      ...to("/blogs/biomaterials-top-5", "/biomaterials-for-bioprinting-top-5-materials"),
      ...to("/blogs/3d-printing-or-bioprinting", "/3d-printing-or-bioprinting-navigating-the-difference"),
      ...to(
        "/blogs/bioinks-secret-sauce",
        "/bioinks-the-secret-sauce-of-bioprinting-for-building-your-tissues",
      ),
      // WordPress archive and feed URLs
      ...to("/blogs", "/author/:path*", "/category/:path*", "/tag/:path*", "/feed", "/comments/feed"),

      // Company
      ...to("/our-story", "/about-us"),
      // Careers used to be its own route; it is now a section of the team page.
      ...to(
        "/team#careers",
        "/careers",
        "/jobs",
        "/embedded-engineer",
        "/marketing-associate-intern",
        "/biotechnology-job-board",
      ),

      // Contact, quote and demo forms
      ...to("/#connect", "/contact-us", "/talk-to-expert", "/partner", "/invest"),
      ...to(
        "/trivima#contact",
        "/quote",
        "/inquire-now",
        "/book-a-demo-trivima-mini",
        "/customize-your-bioprinter",
        "/experience-trivima-registration",
      ),

      // Courses, workshops and contests have no page of their own yet.
      ...to(
        "/news",
        "/certified-course-on-bioprinting",
        "/student-registration",
        "/workshop-support",
        "/poster-competition",
        "/bioprinting-contest",
      ),
      // A WordPress template fragment that got indexed by mistake.
      ...to("/", "/mobile-header"),
    ];
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
