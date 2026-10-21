import type { MetadataRoute } from "next";
import { isDemo } from "@/data";
import { absoluteUrl, publicPages } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isDemo) return [];
  return publicPages.map((p) => ({ url: absoluteUrl(p.path), changeFrequency: "monthly", priority: p.priority }));
}
