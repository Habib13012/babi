import { NextResponse } from "next/server";
import { store } from "@/data";
import { getDb } from "@/lib/db";
import { CheckoutError, createCheckout } from "@/lib/payments/checkout";
import { getPaymentAvailability } from "@/lib/payments/stripe";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site";
import { checkoutSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`checkout:${clientIp(req.headers)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });
  }
  const pay = getPaymentAvailability(store);
  if (!pay.ok) return NextResponse.json({ error: pay.reason }, { status: 503 });

  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide." }, { status: 400 });
  }

  try {
    const { url } = await createCheckout({
      db: getDb(),
      data: store,
      stripe: pay.stripe,
      siteUrl,
      lines: parsed.data.lines,
      termsAcceptedAt: new Date(),
    });
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Le paiement n'a pas pu être initialisé. Aucun montant n'a été débité." }, { status: 502 });
  }
}
