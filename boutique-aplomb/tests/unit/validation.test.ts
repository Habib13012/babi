import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";
import { checkoutSchema, contactSchema, withdrawalSchema } from "@/lib/validation";

describe("validation", () => {
  it("exige l'acceptation des CGV", () => {
    expect(checkoutSchema.safeParse({ lines: [{ variantId: "argent", quantity: 1 }], acceptTerms: false }).success).toBe(false);
    expect(checkoutSchema.safeParse({ lines: [{ variantId: "argent", quantity: 1 }], acceptTerms: true }).success).toBe(true);
  });
  it("ignore tout prix envoyé par le client", () => {
    const r = checkoutSchema.parse({ lines: [{ variantId: "argent", quantity: 1, unitPrice: 1 }], acceptTerms: true });
    expect(r.lines[0]).not.toHaveProperty("unitPrice");
  });
  it("valide les formulaires de contact et de rétractation", () => {
    expect(contactSchema.safeParse({ name: "A", email: "x", message: "court" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "Alex Martin", email: "alex@exemple.test", message: "Bonjour, une question." }).success).toBe(true);
    expect(withdrawalSchema.safeParse({ name: "Alex Martin", email: "alex@exemple.test", orderReference: "APL-1234ABCD" }).success).toBe(true);
    expect(withdrawalSchema.safeParse({ name: "Alex Martin", email: "alex@exemple.test", orderReference: "" }).success).toBe(false);
  });
  it("limite le débit par clé", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("t", 3, 1000, now)).toBe(true);
    expect(rateLimit("t", 3, 1000, now)).toBe(false);
    expect(rateLimit("t", 3, 1000, now + 1001)).toBe(true);
  });
});
