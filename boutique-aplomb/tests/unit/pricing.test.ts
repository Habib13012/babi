import { describe, expect, it } from "vitest";
import { demoData } from "@/data/demo";
import { productionData } from "@/data/production";
import { PricingError, quote } from "@/lib/pricing";
import { formatPrice, feedPrice } from "@/lib/format";

describe("quote", () => {
  it("calcule sous-total, livraison et total depuis le catalogue", () => {
    const q = quote(demoData, [{ variantId: "graphite", quantity: 2 }]);
    expect(q.subtotal).toBe(13800);
    expect(q.shipping).toBe(590);
    expect(q.total).toBe(14390);
    expect(q.lines[0]?.unitPrice).toBe(6900);
  });

  it("regroupe les lignes d'une même variante et applique le plafond global", () => {
    expect(quote(demoData, [{ variantId: "argent", quantity: 2 }, { variantId: "argent", quantity: 1 }]).lines).toHaveLength(1);
    expect(() => quote(demoData, [{ variantId: "argent", quantity: 3 }, { variantId: "graphite", quantity: 3 }])).toThrow(PricingError);
  });

  it("refuse variante inconnue, quantité invalide et panier vide", () => {
    expect(() => quote(demoData, [{ variantId: "or", quantity: 1 }])).toThrow(/inconnue/);
    expect(() => quote(demoData, [{ variantId: "argent", quantity: 0 }])).toThrow(/Quantité/);
    expect(() => quote(demoData, [{ variantId: "argent", quantity: 1.5 }])).toThrow(/Quantité/);
    expect(() => quote(demoData, [])).toThrow(/vide/);
  });

  it("refuse toute vente sans prix réel (données de production actuelles)", () => {
    expect(() => quote(productionData, [{ variantId: "argent", quantity: 1 }])).toThrow(/prix/i);
  });

  it("calcule la TVA incluse seulement en régime standard", () => {
    const std = { ...demoData, seller: { ...demoData.seller, vatRegime: "standard" as const } };
    expect(quote(std, [{ variantId: "argent", quantity: 1 }]).vatIncluded).toBe(1248); // 7490 - 7490/1.2
    expect(quote(demoData, [{ variantId: "argent", quantity: 1 }]).vatIncluded).toBe(0);
  });
});

describe("format", () => {
  it("formate les prix pour l'affichage et pour le flux", () => {
    expect(formatPrice(6900)).toBe("69,00 €");
    expect(feedPrice(6900)).toBe("69.00 EUR");
  });
});
