import { beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import type { DatabaseSync } from "node:sqlite";
import { demoData } from "@/data/demo";
import { getOrder, getStock, openDb } from "@/lib/db";
import { CheckoutError, createCheckout } from "@/lib/payments/checkout";
import { getPaymentAvailability } from "@/lib/payments/stripe";
import { handleStripeEvent } from "@/lib/payments/webhook";

function fakeStripe() {
  const create = vi.fn(async (params: Record<string, unknown>) => ({ id: "cs_test_123456789012", url: "https://checkout.stripe.com/c/pay/cs_test", params }));
  return { stripe: { checkout: { sessions: { create } } } as unknown as Pick<Stripe, "checkout">, create };
}

function sessionEvent(id: string, type: string, session: Partial<Stripe.Checkout.Session>): Stripe.Event {
  return { id, type, object: "event", data: { object: { object: "checkout.session", ...session } } } as unknown as Stripe.Event;
}

let db: DatabaseSync;
beforeEach(() => {
  db = openDb(":memory:");
});

async function checkout(qty = 2) {
  const f = fakeStripe();
  const res = await createCheckout({ db, data: demoData, stripe: f.stripe, siteUrl: "https://exemple.test", lines: [{ variantId: "graphite", quantity: qty }], termsAcceptedAt: new Date() });
  return { ...res, create: f.create };
}

describe("createCheckout", () => {
  it("envoie à Stripe les montants du catalogue, pas ceux du client", async () => {
    const { orderId, create } = await checkout(2);
    const params = create.mock.calls[0]![0] as Stripe.Checkout.SessionCreateParams;
    expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(6900);
    expect(params.shipping_options?.[0]?.shipping_rate_data?.fixed_amount?.amount).toBe(590);
    expect(params.shipping_address_collection?.allowed_countries).toEqual(["FR"]);
    expect(getOrder(db, orderId)).toMatchObject({ status: "pending", total: 14390, checkout_session_id: "cs_test_123456789012" });
  });

  it("refuse une quantité supérieure au stock", async () => {
    await checkout(1).catch(() => {}); // initialise le stock en base
    db.exec("DELETE FROM orders");
    db.prepare("UPDATE inventory SET stock = 1 WHERE variant_id = 'graphite'").run();
    await expect(checkout(2)).rejects.toBeInstanceOf(CheckoutError);
  });
});

describe("handleStripeEvent", () => {
  it("valide la commande une seule fois malgré les renvois du webhook", async () => {
    const { orderId } = await checkout(2);
    const onOrderPaid = vi.fn(async () => {});
    const paid = { id: "cs_test_123456789012", payment_status: "paid" as const, amount_total: 14390, currency: "eur", metadata: { order_id: orderId }, customer_details: { email: "client@exemple.test" } as Stripe.Checkout.Session.CustomerDetails };

    expect(await handleStripeEvent(db, demoData, sessionEvent("evt_1", "checkout.session.completed", paid), { onOrderPaid })).toBe("processed");
    expect(await handleStripeEvent(db, demoData, sessionEvent("evt_1", "checkout.session.completed", paid), { onOrderPaid })).toBe("duplicate");
    expect(await handleStripeEvent(db, demoData, sessionEvent("evt_2", "checkout.session.completed", paid), { onOrderPaid })).toBe("duplicate");

    expect(onOrderPaid).toHaveBeenCalledTimes(1);
    expect(getStock(db, "graphite")).toBe(18);
    expect(getOrder(db, orderId)).toMatchObject({ status: "paid", email: "client@exemple.test", confirmation_email_sent: 1 });
  });

  it("n'accepte pas un paiement différé non encore réglé", async () => {
    const { orderId } = await checkout(1);
    const onOrderPaid = vi.fn(async () => {});
    const r = await handleStripeEvent(db, demoData, sessionEvent("evt_3", "checkout.session.completed", { id: "cs_test_123456789012", payment_status: "unpaid", amount_total: 7490, currency: "eur" }), { onOrderPaid });
    expect(r).toBe("ignored");
    expect(getOrder(db, orderId)?.status).toBe("pending");
    expect(onOrderPaid).not.toHaveBeenCalled();
  });

  it("met la commande en vérification si le montant payé diffère", async () => {
    const { orderId } = await checkout(1);
    await handleStripeEvent(db, demoData, sessionEvent("evt_4", "checkout.session.completed", { id: "cs_test_123456789012", payment_status: "paid", amount_total: 100, currency: "eur" }), { onOrderPaid: async () => {} });
    expect(getOrder(db, orderId)?.status).toBe("needs_review");
  });

  it("marque les sessions expirées sans toucher au stock", async () => {
    const { orderId } = await checkout(1);
    await handleStripeEvent(db, demoData, sessionEvent("evt_5", "checkout.session.expired", { id: "cs_test_123456789012" }), { onOrderPaid: async () => {} });
    expect(getOrder(db, orderId)?.status).toBe("expired");
    expect(getStock(db, "graphite")).toBe(20);
  });

  it("garde la commande payée si l'e-mail échoue, sans le marquer envoyé", async () => {
    const { orderId } = await checkout(1);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await handleStripeEvent(db, demoData, sessionEvent("evt_6", "checkout.session.completed", { id: "cs_test_123456789012", payment_status: "paid", amount_total: 7490, currency: "eur" }), {
      onOrderPaid: async () => {
        throw new Error("smtp down");
      },
    });
    spy.mockRestore();
    expect(getOrder(db, orderId)).toMatchObject({ status: "paid", confirmation_email_sent: 0 });
  });
});

describe("signature webhook", () => {
  it("rejette une signature invalide et accepte une signature valide", () => {
    const stripe = new Stripe("sk_test_dummy");
    const payload = JSON.stringify({ id: "evt_sig", object: "event", type: "checkout.session.completed", data: { object: {} } });
    const secret = "whsec_test_secret";
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
    expect(stripe.webhooks.constructEvent(payload, header, secret).id).toBe("evt_sig");
    expect(() => stripe.webhooks.constructEvent(payload, header, "whsec_autre")).toThrow();
    expect(() => stripe.webhooks.constructEvent(payload.replace("evt_sig", "evt_x"), header, secret)).toThrow();
  });
});

describe("getPaymentAvailability", () => {
  it("refuse une clé live avec des données de démonstration", () => {
    expect(getPaymentAvailability(demoData, { STRIPE_SECRET_KEY: "sk_live_x" })).toMatchObject({ ok: false });
  });
  it("refuse sans clé et accepte une clé de test", () => {
    expect(getPaymentAvailability(demoData, {}).ok).toBe(false);
    expect(getPaymentAvailability(demoData, { STRIPE_SECRET_KEY: "sk_test_x" })).toMatchObject({ ok: true, testMode: true });
  });
});
