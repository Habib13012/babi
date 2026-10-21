import { isDemo, store } from "@/data";
import { currentStock } from "@/lib/inventory";
import { buildMerchantFeed } from "@/lib/merchant-feed";
import { siteUrl } from "@/lib/site";

export const revalidate = 300;

/** Flux produits à déclarer dans Merchant Center (Produits › Sources de données › Fichier planifié). */
export function GET() {
  const { xml, warnings } = buildMerchantFeed(store, currentStock(store), siteUrl);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Robots-Tag": "noindex",
      ...(isDemo || warnings.length ? { "X-Feed-Warnings": String(warnings.length) } : {}),
    },
  });
}
