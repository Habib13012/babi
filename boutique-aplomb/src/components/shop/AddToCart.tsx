"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

export interface VariantOption {
  id: string;
  name: string;
  swatch: string;
  inStock: boolean;
}

interface Props {
  variants: VariantOption[];
  purchasable: boolean;
  maxQuantity: number;
  compact?: boolean;
}

export function AddToCart({ variants, purchasable, maxQuantity, compact = false }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const cart = useCart();
  const initial = variants.find((v) => v.id === params.get("variante") && v.inStock) ?? variants.find((v) => v.inStock) ?? variants[0];
  const [variantId, setVariantId] = useState(initial?.id ?? "");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const selected = variants.find((v) => v.id === variantId);
  const canBuy = purchasable && Boolean(selected?.inStock);
  const inCart = cart.lines.find((l) => l.variantId === variantId)?.quantity ?? 0;
  const remaining = Math.max(0, maxQuantity - cart.count);

  const add = (goToCart: boolean) => {
    if (!canBuy || remaining === 0) return;
    const q = Math.min(qty, remaining);
    cart.add(variantId, q);
    setMessage(`${q} × Socle 01 ${selected?.name} ajouté${q > 1 ? "s" : ""} au panier.`);
    if (goToCart) router.push("/panier");
  };

  return (
    <div className="space-y-6">
      {!compact && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">
            Finition : <span className="font-normal text-graphite/80">{selected?.name}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {variants.map((v) => (
              <label
                key={v.id}
                className={`flex cursor-pointer items-center gap-3 rounded-full border py-2 pl-2 pr-4 text-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-copper ${
                  v.id === variantId ? "border-ink bg-chalk" : "border-ink/15 hover:border-ink/40"
                }`}
              >
                <input type="radio" name="variante" value={v.id} checked={v.id === variantId} onChange={() => setVariantId(v.id)} className="sr-only" />
                <span className="h-6 w-6 rounded-full ring-1 ring-ink/15" style={{ background: v.swatch }} aria-hidden="true" />
                {v.name}
                {!v.inStock && <span className="text-xs text-steel">— indisponible</span>}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {canBuy ? (
        <div className={`flex flex-col gap-3 ${compact ? "sm:flex-row" : "sm:flex-row sm:items-stretch"}`}>
          {!compact && (
            <div className="flex h-12 items-center rounded-full border border-ink/15" role="group" aria-label="Quantité">
              <button type="button" className="h-12 w-12 rounded-full text-lg hover:bg-ink/5 disabled:opacity-30" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Diminuer la quantité">
                −
              </button>
              <output className="w-8 text-center font-semibold" aria-live="polite" aria-label={`Quantité : ${qty}`}>
                {qty}
              </output>
              <button
                type="button"
                className="h-12 w-12 rounded-full text-lg hover:bg-ink/5 disabled:opacity-30"
                onClick={() => setQty((q) => Math.min(Math.max(1, remaining), q + 1))}
                disabled={qty >= remaining}
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
          )}
          <button type="button" className="btn btn-primary flex-1" onClick={() => add(true)} disabled={remaining === 0}>
            Acheter maintenant
          </button>
          {!compact && (
            <button type="button" className="btn btn-ghost flex-1" onClick={() => add(false)} disabled={remaining === 0}>
              Ajouter au panier
            </button>
          )}
        </div>
      ) : (
        <p className="rounded-2xl bg-mist px-5 py-4 text-sm">
          {purchasable ? "Cette finition est actuellement indisponible." : "La vente n'est pas encore ouverte."}{" "}
          <Link href="/contact" className="link">
            Nous contacter
          </Link>
        </p>
      )}

      {remaining === 0 && canBuy && <p className="text-sm text-steel">Limite de {maxQuantity} articles par commande atteinte.</p>}
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
      {message && !compact && (
        <p className="text-sm text-graphite">
          {message}{" "}
          <Link href="/panier" className="link">
            Voir le panier{inCart ? ` (${cart.count})` : ""}
          </Link>
        </p>
      )}
    </div>
  );
}
