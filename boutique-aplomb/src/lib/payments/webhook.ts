import "server-only";
import type Stripe from "stripe";
import type { DatabaseSync } from "node:sqlite";
import type { StoreData } from "@/data/types";
import { getOrder, getOrderBySession, transaction, type OrderRow } from "@/lib/db";
import type { PricedLine } from "@/lib/pricing";

export type WebhookResult = "processed" | "duplicate" | "ignored";

export interface WebhookDeps {
  /** Appelé une seule fois par commande payée, après validation en base. */
  onOrderPaid: (order: OrderRow) => Promise<void>;
}

const PAID_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

/**
 * Traite un événement Stripe DÉJÀ vérifié (signature contrôlée par la route).
 * Idempotent : un même événement ou une même session ne déclenche jamais
 * deux validations de commande, deux décréments de stock ou deux e-mails.
 */
export async function handleStripeEvent(db: DatabaseSync, _data: StoreData, event: Stripe.Event, deps: WebhookDeps): Promise<WebhookResult> {
  let paidOrderId: string | null = null;

  const result = transaction(db, (): WebhookResult => {
    const fresh = db
      .prepare("INSERT OR IGNORE INTO processed_events (event_id, type, processed_at) VALUES (?, ?, ?)")
      .run(event.id, event.type, new Date().toISOString());
    if (fresh.changes === 0) return "duplicate";

    if (!event.type.startsWith("checkout.session.")) return "ignored";
    const session = event.data.object as Stripe.Checkout.Session;
    const order =
      getOrderBySession(db, session.id) ?? (session.metadata?.order_id ? getOrder(db, session.metadata.order_id) : undefined);
    if (!order) {
      console.error(`[webhook] Session ${session.id} sans commande correspondante.`);
      return "ignored";
    }

    if (event.type === "checkout.session.expired") {
      db.prepare("UPDATE orders SET status = 'expired' WHERE id = ? AND status = 'pending'").run(order.id);
      return "processed";
    }
    if (event.type === "checkout.session.async_payment_failed") {
      db.prepare("UPDATE orders SET status = 'failed' WHERE id = ? AND status = 'pending'").run(order.id);
      return "processed";
    }
    if (!PAID_EVENTS.has(event.type)) return "ignored";
    // Paiement différé : on attend async_payment_succeeded.
    if (session.payment_status !== "paid") return "ignored";
    if (order.status === "paid" || order.status === "needs_review") return "duplicate";

    const shippingDetails = session.collected_information?.shipping_details ?? null;
    const email = session.customer_details?.email ?? null;
    const name = shippingDetails?.name ?? session.customer_details?.name ?? null;
    const reasons: string[] = [];

    if (session.amount_total !== order.total || session.currency?.toLowerCase() !== order.currency.toLowerCase()) {
      reasons.push(`Montant Stripe ${session.amount_total} ${session.currency} ≠ commande ${order.total} ${order.currency}`);
    }

    const lines = JSON.parse(order.lines_json) as PricedLine[];
    for (const l of lines) {
      const dec = db.prepare("UPDATE inventory SET stock = stock - ? WHERE variant_id = ? AND stock >= ?").run(l.quantity, l.variantId, l.quantity);
      if (dec.changes === 0) reasons.push(`Stock insuffisant pour ${l.variantId} : contacter le client (remboursement ou délai)`);
    }

    db.prepare(
      `UPDATE orders SET status = ?, email = ?, customer_name = ?, shipping_address_json = ?, paid_at = ?, review_reason = ? WHERE id = ?`,
    ).run(
      reasons.length ? "needs_review" : "paid",
      email,
      name,
      shippingDetails ? JSON.stringify(shippingDetails) : null,
      new Date().toISOString(),
      reasons.length ? reasons.join(" ; ") : null,
      order.id,
    );
    paidOrderId = order.id;
    return "processed";
  });

  if (paidOrderId) {
    const order = getOrder(db, paidOrderId)!;
    if (order.confirmation_email_sent === 0) {
      try {
        await deps.onOrderPaid(order);
        db.prepare("UPDATE orders SET confirmation_email_sent = 1 WHERE id = ?").run(order.id);
      } catch (err) {
        // La commande reste payée ; l'e-mail devra être renvoyé manuellement.
        console.error(`[webhook] Échec d'envoi de la confirmation ${order.id}`, err);
      }
    }
  }
  return result;
}
