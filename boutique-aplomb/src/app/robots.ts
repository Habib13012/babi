import type { MetadataRoute } from "next";
import { isDemo } from "@/data";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Le mode démonstration n'est jamais exploré.
  if (isDemo) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/panier", "/paiement", "/commande/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
