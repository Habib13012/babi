import type { StoreData } from "@/data/types";

/** Calcul des montants partagé par le panier (affichage) et le serveur (autorité). */

export interface CartLine {
  variantId: string;
  quantity: number;
}

export interface PricedLine extends CartLine {
  variantName: string;
  sku: string;
  unitPrice: number;
  lineTotal: number;
}

export interface Quote {
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
  /** Part de TVA incluse dans le total (0 en franchise ou si régime inconnu). */
  vatIncluded: number;
  currency: "EUR";
  shippingMethodId: string;
}

export class PricingError extends Error {
  constructor(
    message: string,
    public readonly code: "PRICE_UNAVAILABLE" | "UNKNOWN_VARIANT" | "VARIANT_UNAVAILABLE" | "INVALID_QUANTITY" | "NO_SHIPPING" | "EMPTY_CART",
  ) {
    super(message);
  }
}

export const VAT_RATE = 0.2;

/** Regroupe les lignes d'une même variante (un client ne peut pas contourner le plafond). */
export function normalizeLines(lines: CartLine[]): CartLine[] {
  const byVariant = new Map<string, number>();
  for (const l of lines) byVariant.set(l.variantId, (byVariant.get(l.variantId) ?? 0) + l.quantity);
  return [...byVariant].map(([variantId, quantity]) => ({ variantId, quantity }));
}

export function quote(data: StoreData, rawLines: CartLine[], shippingMethodId?: string): Quote {
  const lines = normalizeLines(rawLines);
  if (lines.length === 0) throw new PricingError("Le panier est vide.", "EMPTY_CART");
  const price = data.product.price;
  if (!price) throw new PricingError("Le prix n'est pas encore disponible.", "PRICE_UNAVAILABLE");

  const totalQty = lines.reduce((n, l) => n + l.quantity, 0);
  const priced = lines.map((l): PricedLine => {
    const variant = data.product.variants.find((v) => v.id === l.variantId);
    if (!variant) throw new PricingError("Variante inconnue.", "UNKNOWN_VARIANT");
    if (!variant.available) throw new PricingError(`La variante ${variant.name} n'est pas disponible.`, "VARIANT_UNAVAILABLE");
    if (!Number.isInteger(l.quantity) || l.quantity < 1) throw new PricingError("Quantité invalide.", "INVALID_QUANTITY");
    return {
      ...l,
      variantName: variant.name,
      sku: variant.sku,
      unitPrice: price.value,
      lineTotal: price.value * l.quantity,
    };
  });
  if (totalQty > data.payment.maxQuantityPerOrder) {
    throw new PricingError(`Maximum ${data.payment.maxQuantityPerOrder} articles par commande.`, "INVALID_QUANTITY");
  }

  const method = shippingMethodId
    ? data.shipping.methods.find((m) => m.id === shippingMethodId)
    : data.shipping.methods[0];
  if (!method) throw new PricingError("Aucun mode de livraison n'est configuré.", "NO_SHIPPING");

  const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = method.price.value;
  const total = subtotal + shipping;
  const vatIncluded = data.seller.vatRegime === "standard" ? Math.round(total - total / (1 + VAT_RATE)) : 0;

  return { lines: priced, subtotal, shipping, total, vatIncluded, currency: "EUR", shippingMethodId: method.id };
}
