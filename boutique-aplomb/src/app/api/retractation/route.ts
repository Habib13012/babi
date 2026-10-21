import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { store } from "@/data";
import { getDb, insertWithdrawal } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { toFieldErrors, withdrawalSchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Fonction de rétractation en ligne (directive (UE) 2023/2673) :
 * enregistre la déclaration et envoie un accusé de réception horodaté.
 */
export async function POST(req: Request) {
  if (!rateLimit(`withdrawal:${clientIp(req.headers)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
  }
  const parsed = withdrawalSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Certains champs sont invalides.", fields: toFieldErrors(parsed.error) }, { status: 400 });
  const { name, email, orderReference, items, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const id = `RET-${randomUUID().slice(0, 8).toUpperCase()}`;
  const at = new Date();
  try {
    insertWithdrawal(getDb(), { id, orderReference, name, email, items });
  } catch (err) {
    console.error("[retractation]", err);
    return NextResponse.json({ error: "Enregistrement impossible. Envoyez-nous votre rétractation par e-mail ou courrier." }, { status: 500 });
  }

  const when = at.toLocaleString("fr-FR", { timeZone: "Europe/Paris", dateStyle: "long", timeStyle: "short" });
  const ack = [
    `Bonjour ${name},`,
    "",
    `Nous accusons réception de votre rétractation pour la commande ${orderReference}, reçue le ${when} (référence ${id}).`,
    items ? `Articles concernés : ${items}` : "Articles concernés : l'ensemble de la commande.",
    "",
    `Renvoyez le produit dans les ${store.returns.withdrawalDays} jours suivant cette déclaration. Nous vous remboursons au plus tard ${store.returns.refundDays} jours après réception de votre rétractation, avec le même moyen de paiement ; le remboursement peut être différé jusqu'à réception du produit ou preuve de son expédition.`,
    "",
    store.seller.tradeName,
  ].join("\n");

  try {
    await sendEmail({ to: email, subject: `${store.seller.tradeName} — accusé de réception de votre rétractation ${id}`, text: ack });
    const seller = process.env.SELLER_NOTIFICATION_EMAIL;
    if (seller) await sendEmail({ to: seller, replyTo: email, subject: `[Rétractation] ${orderReference} — ${id}`, text: `${name} <${email}>\nCommande : ${orderReference}\nArticles : ${items || "tous"}\nReçue le ${when}` });
  } catch (err) {
    // La déclaration est enregistrée ; l'accusé devra être renvoyé.
    console.error("[retractation] e-mail", err);
  }
  return NextResponse.json({ ok: true, id, receivedAt: at.toISOString() });
}
