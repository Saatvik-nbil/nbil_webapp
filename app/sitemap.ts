import type { MetadataRoute } from "next";
import { machines } from "@/lib/machines";

const BASE_URL = "https://nextbiginnovationlabs.com";

/**
 * Every static route plus the dynamic /machines/[slug] pages, generated from
 * the same `machines` list the pages themselves render from, so so a new
 * machine or a renamed slug is picked up here automatically, never a
 * separately-maintained list that can drift out of sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/trivima`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/consultancy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/dhee-slicer`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/dhee-slicer/guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blogs`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/publications`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blogs/dhee-quick-start`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/our-story`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/team`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/news`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const machineRoutes: MetadataRoute.Sitemap = machines.map((m) => ({
    url: `${BASE_URL}/machines/${m.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...machineRoutes];
}
