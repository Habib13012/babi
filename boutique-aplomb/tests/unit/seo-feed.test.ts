import { describe, expect, it } from "vitest";
import { demoData } from "@/data/demo";
import { productionData } from "@/data/production";
import { buildMerchantFeed } from "@/lib/merchant-feed";
import { productJsonLd } from "@/lib/structured-data";

const site = "https://exemple.test";
const stock = { graphite: 3, argent: 0 };

describe("données structurées", () => {
  const ld = productJsonLd(demoData, stock, site);
  const json = JSON.stringify(ld);

  it("ne contient ni avis ni note", () => {
    expect(json).not.toMatch(/Review|AggregateRating|ratingValue/);
  });

  it("reflète prix et disponibilité réels par variante", () => {
    const variants = ld.hasVariant as Array<{ sku: string; offers: { price: string; availability: string; priceCurrency: string } }>;
    const graphite = variants.find((v) => v.sku === "APL-S01-GR");
    const argent = variants.find((v) => v.sku === "APL-S01-AR");
    expect(graphite!.offers.price).toBe("69.00");
    expect(graphite!.offers.priceCurrency).toBe("EUR");
    expect(graphite!.offers.availability).toBe("https://schema.org/InStock");
    expect(argent!.offers.availability).toBe("https://schema.org/OutOfStock");
  });

  it("déclare des retours payants quand le client paie le retour", () => {
    expect(json).toContain("ReturnShippingFees");
    expect(json).not.toContain("FreeReturn");
  });

  it("n'émet aucune offre sans prix", () => {
    expect(JSON.stringify(productJsonLd(productionData, stock, site))).not.toContain("Offer");
  });

  it("n'utilise pas les images prototypes", () => {
    expect(ld).not.toHaveProperty("image");
  });
});

describe("flux Merchant Center", () => {
  it("est cohérent avec la page (prix, livraison, disponibilité, lien)", () => {
    const { xml, warnings } = buildMerchantFeed(demoData, stock, site);
    expect(xml).toContain("<g:id>APL-S01-GR</g:id>");
    expect(xml).toContain("<g:price>69.00 EUR</g:price>");
    expect(xml).toContain("<g:price>5.90 EUR</g:price>");
    expect(xml).toMatch(/APL-S01-GR[\s\S]*?<g:availability>in_stock/);
    expect(xml).toMatch(/APL-S01-AR[\s\S]*?<g:availability>out_of_stock/);
    expect(xml).toContain(`<g:link>${site}/produit/socle-01?variante=graphite</g:link>`);
    expect(xml).toContain("<g:identifier_exists>no</g:identifier_exists>");
    expect(warnings.join(" ")).toMatch(/démonstration/);
  });

  it("échappe le XML", () => {
    const data = { ...demoData, product: { ...demoData.product, tagline: "A & B <c>" } };
    expect(buildMerchantFeed(data, stock, site).xml).toContain("A &amp; B &lt;c&gt;");
  });

  it("ne publie aucun article sans prix", () => {
    expect(buildMerchantFeed(productionData, stock, site).xml).not.toContain("<item>");
  });
});
