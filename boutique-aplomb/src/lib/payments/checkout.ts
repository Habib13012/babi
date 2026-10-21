import "server-only";
import { randomUUID } from "node:crypto";
import type Stripe from "stripe";
import type { DatabaseSync } from "node:sqlite";
import type { StoreData } from "@/data/types";
import { attachSession, getStock, insertOrder, seedInventory } from "@/lib/db";
import { PricingError, quote, type CartLine } from "@/lib/pricing";

export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

type SessionCreator = Pick<Stripe, "checkout">;

/**
 * Crée la commande « pending » puis la session Stripe Checkout.
 * Les montants sont recalculés ici à partir du catalogue : le prix
 * envoyé par le navigateur n'est jamais utilisé.
 */
export async function createCheckout(opts: {
  db: DatabaseSync;
  data: StoreData;
  stripe: SessionCreator;
  siteUrl: string;
  lines: CartLine[];
  termsAcceptedAt: Date;
}): Promise<{ orderId: string; url: string }> {
  const { db, data, stripe, siteUrl } = opts;

  let q;
  try {
    q = quote(data, opts.lines);
  } catch (err) {
    if (err instanceof PricingError) throw new CheckoutError(err.message, 422);
    throw err;
  }

  seedInventory(db, data);
  for (const l of q.lines) {
    if (getStock(db, l.variantId) < l.quantity) {
      throw new CheckoutError(`Stock insuffisant pour la variante ${l.variantName}.`, 409);
    }
  }

  const orderId = `APL-${randomUUID().slice(0, 8).toUpperCase()}`;
  insertOrder(db, {
    id: orderId,
    lines_json: JSON.stringify(q.lines),
    subtotal: q.subtotal,
    shipping: q.shipping,
    total: q.total,
    currency: q.currency,
    shipping_method_id: q.shippingMethodId,
    terms_version: data.termsVersion,
    terms_accepted_at: opts.termsAcceptedAt.toISOString(),
  });

  const method = data.shipping.methods.find((m) => m.id === q.shippingMethodId)!;
  const [hMin, hMax] = method.handlingDays.value;
  const [tMin, tMax] = method.transitDays.value;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      locale: "fr",
      // Filtre sur les moyens activés dans le tableau de bord Stripe : carte uniquement.
      allowed_payment_method_types: ["card"],
      client_reference_id: orderId,
      metadata: { order_id: orderId, terms_version: data.termsVersion },
      payment_intent_data: { metadata: { order_id: orderId } },
      line_items: q.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "eur",
          unit_amount: l.unitPrice,
          product_data: {
            name: `${data.product.brand} ${data.product.name} — ${l.variantName}`,
            metadata: { sku: l.sku, variant_id: l.variantId },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: data.shipping.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: method.label,
            fixed_amount: { amount: method.price.value, currency: "eur" },
            delivery_estimate: {
              minimum: { unit: "business_day", value: hMin + tMin },
              maximum: { unit: "business_day", value: hMax + tMax },
            },
          },
        },
      ],
      phone_number_collection: { enabled: false },
      success_url: `${siteUrl}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/panier?paiement=annule`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    { idempotencyKey: `checkout-${orderId}` },
  );

  if (!session.url) throw new CheckoutError("Stripe n'a pas renvoyé d'URL de paiement.", 502);
  attachSession(db, orderId, session.id);
  return { orderId, url: session.url };
}
