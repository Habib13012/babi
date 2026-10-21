import Link from "next/link";
import { DemoTag, Missing } from "@/components/ui/Missing";
import type { StoreData } from "@/data/types";
import { formatPrice, formatRange } from "@/lib/format";

export function PriceTag({ data, className = "" }: { data: StoreData; className?: string }) {
  const price = data.product.price;
  if (!price) return <p className={className}><Missing>prix de vente</Missing></p>;
  return (
    <p className={className}>
      <span className="font-display text-4xl tracking-tight">{formatPrice(price.value)}</span>
      {price.status === "demo" && <DemoTag label="prix démo" />}
      <span className="mt-1 block text-sm text-steel">{taxMention(data)}</span>
    </p>
  );
}

export function taxMention(data: StoreData): string {
  if (data.seller.vatRegime === "franchise") return "Prix final — TVA non applicable, art. 293 B du CGI. Livraison en sus.";
  if (data.seller.vatRegime === "standard") return "Prix TTC, TVA 20 % incluse. Livraison en sus.";
  return "Prix toutes taxes comprises. Livraison en sus.";
}

/** Informations essentielles avant l'achat : tout est affiché, rien n'est caché derrière une interaction. */
export function OfferSummary({ data, inStock }: { data: StoreData; inStock: boolean }) {
  const method = data.shipping.methods[0];
  const r = data.returns;
  return (
    <dl className="divide-y divide-ink/10 border-y border-ink/10 text-sm">
      <Row label="Disponibilité">
        {data.product.price ? (inStock ? "En stock" : "Indisponible pour le moment") : "Vente non ouverte"}
      </Row>
      <Row label="Livraison">
        {method ? (
          <>
            {method.label} — {formatPrice(method.price.value)}
            {method.price.status === "demo" && <DemoTag />}
            <br />
            <span className="text-steel">
              Expédition sous {formatRange(method.handlingDays.value)}, puis {formatRange(method.transitDays.value)} de transport
              {method.handlingDays.status === "demo" && <DemoTag />}
            </span>
          </>
        ) : (
          <Missing>tarif et délai de livraison</Missing>
        )}
      </Row>
      <Row label="Zone">{data.shipping.zoneLabel} uniquement</Row>
      <Row label="Expédié depuis">
        {data.shipping.shipsFrom ? `${data.shipping.shipsFrom.city}, ${data.shipping.shipsFrom.country}` : <Missing>lieu d&apos;expédition</Missing>}
      </Row>
      <Row label="Retours">
        {r.withdrawalDays} jours pour changer d&apos;avis après réception,{" "}
        {r.returnShippingPaidBy ? (
          <>
            frais de retour {r.returnShippingPaidBy.value === "customer" ? "à votre charge" : "pris en charge par nous"}
            {r.returnShippingPaidBy.status === "demo" && <DemoTag />}
          </>
        ) : (
          <Missing>prise en charge des frais de retour</Missing>
        )}
        .{" "}
        <Link href="/retours" className="link">
          Détails
        </Link>
      </Row>
      <Row label="Paiement">{data.payment.methods.join(", ")}</Row>
    </dl>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5">
      <dt className="font-semibold">{label}</dt>
      <dd className="text-graphite">{children}</dd>
    </div>
  );
}
