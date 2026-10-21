import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/** Métadonnées uniques par page : titre, description, canonical, Open Graph. */
export function pageMetadata({ title, description, path, noindex = false }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), type: "website", locale: "fr_FR", siteName: "Aplomb" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
