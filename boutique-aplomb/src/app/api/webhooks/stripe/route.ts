import { NextResponse } from "next/server";
import { store } from "@/data";
import { getDb } from "@/lib/db";
import { orderConfirmationEmail, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { getPaymentAvailability } from "@/lib/payments/stripe";
import { handleStripeEvent } from "@/lib/payments/webhook";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const pay = getPaymentAvailability(store);
  if (!secret || !pay.ok) return NextResponse.json({ error: "Webhook non configuré." }, { status: 503 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Signature absente." }, { status: 400 });

  // Le corps brut est indispensable à la vérification de la signature.
  const payload = await req.text();
  let event;
  try {
    event = pay.stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    const result = await handleStripeEvent(getDb(), store, event, {
      onOrderPaid: async (order) => {
        if (order.email) await sendEmail(orderConfirmationEmail(order, store, siteUrl));
        const seller = process.env.SELLER_NOTIFICATION_EMAIL;
        if (seller) {
          await sendEmail({
            to: seller,
            subject: `Nouvelle commande ${order.id} (${order.status})`,
            text: `Commande ${order.id} — ${formatPrice(order.total)}\nStatut : ${order.status}${order.review_reason ? `\nÀ vérifier : ${order.review_reason}` : ""}`,
          });
        }
      },
    });
    return NextResponse.json({ received: true, result });
  } catch (err) {
    console.error("[webhook]", err);
    // 500 : Stripe renverra l'événement (le traitement est idempotent).
    return NextResponse.json({ error: "Traitement impossible." }, { status: 500 });
  }
}
