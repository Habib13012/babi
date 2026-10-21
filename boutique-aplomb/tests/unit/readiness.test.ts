import { describe, expect, it } from "vitest";
import { demoData } from "@/data/demo";
import { productionData } from "@/data/production";
import { getLaunchBlockers } from "@/lib/readiness";

describe("getLaunchBlockers", () => {
  it("bloque la production tant que l'identité du vendeur est absente", () => {
    const ids = getLaunchBlockers(productionData, {}).map((b) => b.id);
    for (const id of ["seller.siren", "seller.address", "seller.phone", "seller.mediator", "product.price", "product.images", "shipping.shipsFrom", "env.stripe"]) {
      expect(ids).toContain(id);
    }
  });

  it("signale les valeurs de démonstration comme bloquantes", () => {
    const ids = getLaunchBlockers(demoData, {}).map((b) => b.id);
    expect(ids).toContain("mode");
    expect(ids).toContain("product.price.status");
    expect(ids.some((i) => i.startsWith("product.spec."))).toBe(true);
  });

  it("n'invente aucune identité légale dans les données de démonstration", () => {
    const s = demoData.seller;
    expect([s.legalName, s.siren, s.vatNumber, s.address, s.phone, s.email]).toEqual([null, null, null, null, null, null]);
  });
});
