import type { StoreData } from "@/data/types";

/**
 * Données structurées Product/Offer construites à partir de la même source
 * que la page et le flux Merchant Center. Aucune donnée Review ou
 * AggregateRating n'est générée.
 */

export type StockMap = Record<string, number>;

const toPrice = (cents: number) => (cents / 100).toFixed(2);

export function isVariantInStock(data: StoreData, stock: StockMap, variantId: string): boolean {
  const v = data.product.variants.find((x) => x.id === variantId);
  return Boolean(v?.available && (stock[variantId] ?? 0) > 0);
}

export function shippingDetails(data: StoreData) {
  return data.shipping.methods.map((m) => ({
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: toPrice(m.price.value), currency: "EUR" },
    shippingDestination: data.shipping.countries.map((c) => ({ "@type": "DefinedRegion", addressCountry: c })),
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: m.handlingDays.value[0], maxValue: m.handlingDays.value[1], unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: m.transitDays.value[0], maxValue: m.transitDays.value[1], unitCode: "DAY" },
    },
  }));
}

export function returnPolicy(data: StoreData) {
  const r = data.returns;
  if (!r.returnShippingPaidBy) return undefined;
  const customerPays = r.returnShippingPaidBy.value === "customer";
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: data.shipping.countries,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: r.withdrawalDays,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: customerPays ? "https://schema.org/ReturnShippingFees" : "https://schema.org/FreeReturn",
    ...(customerPays && r.estimatedReturnCost
      ? { returnShippingFeesAmount: { "@type": "MonetaryAmount", value: toPrice(r.estimatedReturnCost.value), currency: "EUR" } }
      : {}),
  };
}

export function productJsonLd(data: StoreData, stock: StockMap, siteUrl: string) {
  const p = data.product;
  const url = `${siteUrl}/produit/${p.slug}`;
  const images = p.images.filter((i) => i.kind === "photo").map((i) => `${siteUrl}${i.src}`);
  const policy = returnPolicy(data);

  const variants = p.variants.map((v) => ({
    "@type": "Product",
    name: `${p.brand} ${p.name} — ${v.name}`,
    sku: v.sku,
    color: v.name,
    ...(p.mpn ? { mpn: `${p.mpn}-${v.id.toUpperCase()}` } : {}),
    ...(images.length ? { image: images } : {}),
    ...(p.price
      ? {
          offers: {
            "@type": "Offer",
            url: `${url}?variante=${v.id}`,
            price: toPrice(p.price.value),
            priceCurrency: p.currency,
            availability: isVariantInStock(data, stock, v.id) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            ...(data.shipping.methods.length ? { shippingDetails: shippingDetails(data) } : {}),
            ...(policy ? { hasMerchantReturnPolicy: policy } : {}),
            seller: { "@type": "Organization", name: data.seller.legalName ?? data.seller.tradeName },
          },
        }
      : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: `${p.brand} ${p.name}`,
    description: p.shortDescription,
    url,
    brand: { "@type": "Brand", name: p.brand },
    productGroupID: p.slug,
    variesBy: ["https://schema.org/color"],
    ...(images.length ? { image: images } : {}),
    hasVariant: variants,
  };
}

export function organizationJsonLd(data: StoreData, siteUrl: string) {
  const s = data.seller;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.tradeName,
    ...(s.legalName ? { legalName: s.legalName } : {}),
    url: siteUrl,
    logo: `${siteUrl}/brand/logo.svg`,
    ...(s.email ? { email: s.email } : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.siren ? { taxID: s.siren } : {}),
    ...(s.vatNumber ? { vatID: s.vatNumber } : {}),
    ...(s.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: s.address.street,
            postalCode: s.address.postalCode,
            addressLocality: s.address.city,
            addressCountry: s.address.country,
          },
        }
      : {}),
  };
}
