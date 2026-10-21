import "server-only";
import Stripe from "stripe";
import type { StoreData } from "@/data/types";
import { getLaunchBlockers } from "@/lib/readiness";

let client: Stripe | null = null;

export type PaymentAvailability =
  | { ok: true; stripe: Stripe; testMode: boolean }
  | { ok: false; reason: string };

/**
 * Refuse tout paiement réel tant que la boutique n'est pas prête :
 * - pas de clé → paiement indisponible ;
 * - données de démo → clés de test uniquement ;
 * - clé live → aucune information bloquante ne doit subsister.
 */
export function getPaymentAvailability(data: StoreData, env: Record<string, string | undefined> = process.env): PaymentAvailability {
  const key = env.STRIPE_SECRET_KEY;
  if (!key) return { ok: false, reason: "Le paiement en ligne n'est pas encore configuré." };
  const live = key.startsWith("sk_live_") || key.startsWith("rk_live_");
  if (live && data.mode !== "production") {
    return { ok: false, reason: "Clé Stripe live refusée : le site utilise des données de démonstration." };
  }
  if (live) {
    const blockers = getLaunchBlockers(data, env);
    if (blockers.length > 0) return { ok: false, reason: `Paiement réel refusé : ${blockers.length} information(s) bloquante(s).` };
  }
  client ??= new Stripe(key);
  return { ok: true, stripe: client, testMode: !live };
}
