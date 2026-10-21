"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DemoTag } from "@/components/ui/Missing";
import type { StoreData } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { PricingError, quote, type Quote } from "@/lib/pricing";
import { useCart } from "./CartProvider";

export function useQuote(data: StoreData): { q: Quote | null; error: string | null } {
  const { lines } = useCart();
  return useMemo(() => {
    if (lines.length === 0) return { q: null, error: null };
    try {
      return { q: quote(data, lines), error: null };
    } catch (e) {
      return { q: null, error: e instanceof PricingError ? e.message : "Panier invalide." };
    }
  }, [data, lines]);
}

export function Totals({ q, data }: { q: Quote; data: StoreData }) {
  const method = data.shipping.methods.find((m) => m.id === q.shippingMethodId);
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt>Sous-total</dt>
        <dd>{formatPrice(q.subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>Livraison{method ? ` — ${method.label}` : ""}</dt>
        <dd className="shrink-0">
          {formatPrice(q.shipping)}
          {method?.price.status === "demo" && <DemoTag />}
        </dd>
      </div>
      <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold">
        <dt>Total à payer</dt>
        <dd>{formatPrice(q.total)}</dd>
      </div>
      <p className="text-xs text-steel">
        {data.seller.vatRegime === "franchise"
          ? "TVA non applicable, art. 293 B du CGI."
          : data.seller.vatRegime === "standard"
            ? `Dont TVA 20 % : ${formatPrice(q.vatIncluded)}.`
            : "Toutes taxes comprises."}{" "}
        Aucun autre frais ne sera ajouté.
      </p>
    </dl>
  );
}

export function CartView({ data }: { data: StoreData }) {
  const cart = useCart();
  const params = useSearchParams();
  const { q, error } = useQuote(data);
  const variants = data.product.variants;

  if (!cart.ready) return <p className="text-steel">Chargement du panier…</p>;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div>
        {params.get("paiement") === "annule" && (
          <p role="status" className="mb-6 rounded-2xl bg-mist px-5 py-4 text-sm">
            Paiement annulé : aucun montant n&apos;a été débité. Votre panier est conservé.
          </p>
        )}
        {cart.lines.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg">Votre panier est vide.</p>
            <Link href={`/produit/${data.product.slug}`} className="btn btn-primary mt-6">
              Voir {data.product.name}
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {cart.lines.map((l) => {
              const v = variants.find((x) => x.id === l.variantId);
              return (
                <li key={l.variantId} className="flex flex-wrap items-center gap-5 py-6">
                  <span className="h-16 w-16 shrink-0 rounded-2xl ring-1 ring-ink/10" style={{ background: v?.swatch ?? "#ddd" }} aria-hidden="true" />
                  <div className="min-w-40 flex-1">
                    <p className="font-semibold">
                      {data.product.brand} {data.product.name}
                    </p>
                    <p className="text-sm text-steel">Finition {v?.name ?? "inconnue"}</p>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <span>Quantité</span>
                    <select
                      className="field !min-h-10 !w-20 !py-1"
                      value={l.quantity}
                      onChange={(e) => cart.setQuantity(l.variantId, Number(e.target.value))}
                    >
                      {Array.from({ length: data.payment.maxQuantityPerOrder }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="w-24 text-right font-semibold">{data.product.price ? formatPrice(data.product.price.value * l.quantity) : "—"}</p>
                  <button type="button" className="text-sm text-steel underline underline-offset-2 hover:text-ink" onClick={() => cart.remove(l.variantId)}>
                    Retirer<span className="sr-only"> {v?.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {cart.lines.length > 0 && (
        <aside className="card h-fit space-y-6 p-7" aria-label="Récapitulatif">
          <h2 className="font-sans text-lg font-semibold">Récapitulatif</h2>
          {error && (
            <p role="alert" className="text-sm text-[#b3261e]">
              {error}
            </p>
          )}
          {q && <Totals q={q} data={data} />}
          <Link href="/paiement" className={`btn btn-primary w-full ${!q ? "pointer-events-none opacity-45" : ""}`} aria-disabled={!q}>
            Passer à la commande
          </Link>
          <p className="text-xs leading-relaxed text-steel">
            Livraison en {data.shipping.zoneLabel} uniquement. Le montant est recalculé par nos serveurs avant le paiement.
          </p>
        </aside>
      )}
    </div>
  );
}
