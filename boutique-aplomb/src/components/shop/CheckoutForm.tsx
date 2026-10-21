"use client";

import Link from "next/link";
import { useState } from "react";
import type { StoreData } from "@/data/types";
import { useCart } from "./CartProvider";
import { Totals, useQuote } from "./CartView";

export function CheckoutForm({ data, available, unavailableReason, testMode }: { data: StoreData; available: boolean; unavailableReason?: string; testMode: boolean }) {
  const cart = useCart();
  const { q, error } = useQuote(data);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState(false);

  if (!cart.ready) return <p className="text-steel">Chargement…</p>;
  if (cart.lines.length === 0) {
    return (
      <p>
        Votre panier est vide.{" "}
        <Link href={`/produit/${data.product.slug}`} className="link">
          Retour au produit
        </Link>
      </p>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!accepted) {
      setTermsError(true);
      document.getElementById("cgv")?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cart.lines, acceptTerms: true }),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) throw new Error(body.error ?? "Le paiement n'a pas pu être initialisé.");
      window.location.assign(body.url);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erreur inattendue.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <section className="card space-y-4 p-7" aria-labelledby="info-precontract">
          <h2 id="info-precontract" className="font-sans text-lg font-semibold">
            Avant de commander
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-graphite">
            <li>
              Produit : {data.product.brand} {data.product.name}, {data.product.tagline.toLowerCase()} —{" "}
              <Link className="link" href={`/produit/${data.product.slug}#caracteristiques`}>
                caractéristiques
              </Link>
              .
            </li>
            <li>
              Vendeur : {data.seller.legalName ?? data.seller.tradeName} —{" "}
              <Link className="link" href="/mentions-legales">
                coordonnées complètes
              </Link>
              .
            </li>
            <li>
              Livraison en {data.shipping.zoneLabel} : adresse saisie sur la page de paiement sécurisée.{" "}
              <Link className="link" href="/livraison">
                Délais et tarifs
              </Link>
              .
            </li>
            <li>
              Droit de rétractation de {data.returns.withdrawalDays} jours à compter de la réception.{" "}
              <Link className="link" href="/retours">
                Conditions
              </Link>
              .
            </li>
            <li>Garantie légale de conformité (2 ans) et garantie des vices cachés.</li>
          </ul>
        </section>

        <div className="space-y-2">
          <label className="flex items-start gap-3 text-sm leading-relaxed">
            <input
              id="cgv"
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-ink)]"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setTermsError(false);
              }}
              aria-invalid={termsError}
              aria-describedby={termsError ? "cgv-error" : undefined}
            />
            <span>
              J&apos;ai lu et j&apos;accepte les{" "}
              <Link href="/cgv" className="link" target="_blank">
                conditions générales de vente
              </Link>{" "}
              (version du {data.termsVersion}) et j&apos;ai pris connaissance de la{" "}
              <Link href="/confidentialite" className="link" target="_blank">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {termsError && (
            <p id="cgv-error" className="pl-8 text-sm text-[#b3261e]">
              Veuillez accepter les conditions générales de vente pour continuer.
            </p>
          )}
        </div>
      </div>

      <aside className="card h-fit space-y-6 p-7" aria-label="Récapitulatif de la commande">
        <h2 className="font-sans text-lg font-semibold">Votre commande</h2>
        <ul className="space-y-2 text-sm">
          {q?.lines.map((l) => (
            <li key={l.variantId} className="flex justify-between gap-4">
              <span>
                {data.product.name} {l.variantName} × {l.quantity}
              </span>
            </li>
          ))}
        </ul>
        {error && (
          <p role="alert" className="text-sm text-[#b3261e]">
            {error}
          </p>
        )}
        {q && <Totals q={q} data={data} />}
        {serverError && (
          <p role="alert" className="rounded-xl bg-[#fde8e6] px-4 py-3 text-sm text-[#8c1d18]">
            {serverError}
          </p>
        )}
        {!available ? (
          <p role="status" className="rounded-xl bg-warn-bg px-4 py-3 text-sm text-warn">
            {unavailableReason}
          </p>
        ) : (
          <>
            {testMode && (
              <p className="rounded-xl bg-warn-bg px-4 py-3 text-xs font-semibold text-warn">Mode test Stripe : aucune somme réelle ne sera prélevée.</p>
            )}
            <button type="submit" className="btn btn-primary w-full" disabled={submitting || !q}>
              {submitting ? "Redirection vers le paiement…" : "Commander avec obligation de paiement"}
            </button>
          </>
        )}
        <p className="text-xs leading-relaxed text-steel">
          Vous saisirez votre adresse et votre carte sur la page sécurisée de Stripe. La commande n&apos;est confirmée qu&apos;après validation du paiement par Stripe.
        </p>
      </aside>
    </form>
  );
}
