import type { StoreData } from "@/data/types";
import { feedPrice } from "@/lib/format";
import { isVariantInStock, type StockMap } from "@/lib/structured-data";

/**
 * Flux produits Google Merchant Center (RSS 2.0, espace de noms g:).
 * Une entrée par variante, regroupées par item_group_id. Généré à partir
 * des mêmes données que la page produit et le JSON-LD.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const tag = (name: string, value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "" : `      <${name}>${esc(String(value))}</${name}>\n`;

export interface FeedResult {
  xml: string;
  /** Problèmes empêchant une soumission valide. */
  warnings: string[];
}

export function buildMerchantFeed(data: StoreData, stock: StockMap, siteUrl: string): FeedResult {
  const p = data.product;
  const warnings: string[] = [];
  if (data.mode !== "production") warnings.push("Données de démonstration : ne pas soumettre ce flux.");
  if (!p.price) warnings.push("Prix absent : aucun article ne peut être soumis.");
  const photos = p.images.filter((i) => i.kind === "photo");
  if (photos.length === 0) warnings.push("Aucune photo réelle : image_link manquant.");
  if (!p.gtin && !p.mpn) warnings.push("Ni GTIN ni MPN : identifier_exists=no sera envoyé.");
  if (data.shipping.methods.length === 0) warnings.push("Aucune livraison configurée.");

  const items = p.price
    ? p.variants
        .map((v) => {
          const [main, ...extra] = photos;
          const method = data.shipping.methods[0];
          return (
            "    <item>\n" +
            tag("g:id", v.sku) +
            tag("g:item_group_id", p.slug) +
            tag("g:title", `${p.brand} ${p.name} – ${p.tagline} – ${v.name}`) +
            tag("g:description", [p.shortDescription, ...p.description].join(" ")) +
            tag("g:link", `${siteUrl}/produit/${p.slug}?variante=${v.id}`) +
            tag("g:image_link", main ? `${siteUrl}${main.src}` : null) +
            extra.slice(0, 10).map((i) => tag("g:additional_image_link", `${siteUrl}${i.src}`)).join("") +
            tag("g:availability", isVariantInStock(data, stock, v.id) ? "in_stock" : "out_of_stock") +
            tag("g:price", feedPrice(p.price!.value)) +
            tag("g:condition", p.condition) +
            tag("g:brand", p.brand) +
            tag("g:gtin", p.gtin) +
            tag("g:mpn", p.mpn ? `${p.mpn}-${v.id.toUpperCase()}` : null) +
            (!p.gtin && !p.mpn ? tag("g:identifier_exists", "no") : "") +
            tag("g:color", v.name) +
            tag("g:google_product_category", p.googleProductCategory) +
            tag("g:product_type", "Bureau > Supports d'ordinateur portable") +
            (method
              ? "      <g:shipping>\n" +
                data.shipping.countries.map((c) => `        <g:country>${esc(c)}</g:country>\n`).join("") +
                `        <g:service>${esc(method.label)}</g:service>\n` +
                `        <g:price>${feedPrice(method.price.value)}</g:price>\n` +
                `        <g:min_handling_time>${method.handlingDays.value[0]}</g:min_handling_time>\n` +
                `        <g:max_handling_time>${method.handlingDays.value[1]}</g:max_handling_time>\n` +
                `        <g:min_transit_time>${method.transitDays.value[0]}</g:min_transit_time>\n` +
                `        <g:max_transit_time>${method.transitDays.value[1]}</g:max_transit_time>\n` +
                "      </g:shipping>\n"
              : "") +
            "    </item>\n"
          );
        })
        .join("")
    : "";

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    (warnings.length ? `<!-- ${esc(warnings.join(" | "))} -->\n` : "") +
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n' +
    "  <channel>\n" +
    `    <title>${esc(data.seller.tradeName)}</title>\n` +
    `    <link>${esc(siteUrl)}</link>\n` +
    `    <description>${esc(`${p.brand} ${p.name} — ${p.tagline}`)}</description>\n` +
    items +
    "  </channel>\n" +
    "</rss>\n";

  return { xml, warnings };
}
