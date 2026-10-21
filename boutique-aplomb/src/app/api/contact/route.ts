import { NextResponse } from "next/server";
import { store } from "@/data";
import { sendEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req.headers)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Trop de messages envoyés. Réessayez plus tard." }, { status: 429 });
  }
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Certains champs sont invalides.", fields: toFieldErrors(parsed.error) }, { status: 400 });
  const { name, email, orderReference, message, website } = parsed.data;
  // Robot détecté (champ piège rempli) : réponse neutre, rien n'est envoyé.
  if (website) return NextResponse.json({ ok: true });

  const to = process.env.SELLER_NOTIFICATION_EMAIL ?? store.seller.email;
  if (!to) return NextResponse.json({ error: "Le formulaire n'est pas encore relié à une boîte de réception." }, { status: 503 });
  try {
    await sendEmail({
      to,
      replyTo: email,
      subject: `[Contact] ${name}${orderReference ? ` — ${orderReference}` : ""}`,
      text: `De : ${name} <${email}>\nCommande : ${orderReference || "—"}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Envoi impossible pour le moment. Écrivez-nous directement par e-mail." }, { status: 502 });
  }
}
