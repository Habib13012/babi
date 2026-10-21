import "server-only";
import type { OrderRow } from "@/lib/db";
import type { StoreData } from "@/data/types";
import type { PricedLine } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

/**
 * Envoi via l'API HTTP de Resend. Sans clé, le message est journalisé
 * (développement uniquement) : ce n'est pas un envoi réel.
 */
export async function sendEmail(msg: EmailMessage, env: Record<string, string | undefined> = process.env): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    if (env.NODE_ENV === "production" && env.STORE_DATA_MODE === "production") {
      throw new Error("Envoi d'e-mails non configuré (RESEND_API_KEY / EMAIL_FROM).");
    }
    console.info(`[email:dev] Non envoyé — à : ${msg.to}\nObjet : ${msg.subject}\n${msg.text}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [msg.to], subject: msg.subject, text: msg.text, reply_to: msg.replyTo }),
  });
  if (!res.ok) throw new Error(`Resend a répondu ${res.status} : ${await res.text()}`);
}

export function orderConfirmationEmail(order: OrderRow, data: StoreData, siteUrl: string): EmailMessage {
  const lines = JSON.parse(order.lines_json) as PricedLine[];
  const method = data.shipping.methods.find((m) => m.id === order.shipping_method_id);
  const review = order.status === "needs_review";
  const text = [
    `Bonjour${order.customer_name ? ` ${order.customer_name}` : ""},`,
    "",
    review
      ? `Nous avons bien reçu votre paiement pour la commande ${order.id}. Un contrôle est nécessaire avant l'expédition : nous vous contactons sous 2 jours ouvrés. Si nous ne pouvons pas honorer la commande, vous serez intégralement remboursé.`
      : `Votre paiement est confirmé. Merci pour votre commande ${order.id}.`,
    "",
    ...lines.map((l) => `- ${data.product.brand} ${data.product.name} (${l.variantName}) × ${l.quantity} : ${formatPrice(l.lineTotal)}`),
    `- Livraison${method ? ` (${method.label})` : ""} : ${formatPrice(order.shipping)}`,
    `Total payé : ${formatPrice(order.total)} TTC`,
    "",
    `Conditions générales de vente acceptées (version ${order.terms_version}) : ${siteUrl}/cgv`,
    `Vous disposez d'un délai de ${data.returns.withdrawalDays} jours à compter de la réception pour exercer votre droit de rétractation : ${siteUrl}/retractation`,
    "",
    `${data.seller.tradeName}${data.seller.legalName ? ` — ${data.seller.legalName}` : ""}`,
    data.seller.email ? `Contact : ${data.seller.email}` : "",
  ].join("\n");
  return { to: order.email!, subject: `${data.seller.tradeName} — commande ${order.id} ${review ? "reçue" : "confirmée"}`, text };
}
