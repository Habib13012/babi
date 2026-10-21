import Link from "next/link";
import { store } from "@/data";
import { getDb, getOrderBySession, type OrderRow } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import type { PricedLine } from "@/lib/pricing";
import { StatusRefresher } from "./StatusRefresher";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({ title: "Confirmation de commande", description: "Statut de votre commande Aplomb.", path: "/commande/confirmation", noindex: true });

const COPY: Record<OrderRow["status"], { title: string; body: string }> = {
  pending: {
    title: "Paiement en cours de vérification",
    body: "Nous attendons la confirmation de Stripe. Cette page se met à jour automatiquement ; vous recevrez un e-mail dès que le paiement sera confirmé.",
  },
  paid: { title: "Merci, votre commande est confirmée", body: "Le paiement a été validé. Un e-mail de confirmation vous a été envoyé." },
  needs_review: {
    title: "Paiement reçu — vérification nécessaire",
    body: "Votre paiement a bien été reçu mais un contrôle est nécessaire avant l'expédition. Nous vous contactons sous 2 jours ouvrés ; si la commande ne peut être honorée, vous serez intégralement remboursé.",
  },
  expired: { title: "Session de paiement expirée", body: "Aucun montant n'a été débité. Vous pouvez reprendre votre commande depuis le panier." },
  failed: { title: "Le paiement a échoué", body: "Aucune commande n'a été validée. Vous pouvez réessayer depuis le panier." },
};

export default async function ConfirmationPage({ searchParams }: PageProps<"/commande/confirmation">) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" && /^cs_[A-Za-z0-9_]{10,200}$/.test(sp.session_id) ? sp.session_id : null;
  const order = sessionId ? getOrderBySession(getDb(), sessionId) : undefined;

  if (!order) {
    return (
      <div className="container-page max-w-2xl py-20">
        <h1 className="text-5xl">Commande introuvable</h1>
        <p className="mt-6 text-graphite">
          Nous ne trouvons pas cette commande. Si vous avez été débité, <Link href="/contact" className="link">contactez-nous</Link> avec l&apos;e-mail de confirmation de Stripe.
        </p>
      </div>
    );
  }

  const copy = COPY[order.status];
  const lines = JSON.parse(order.lines_json) as PricedLine[];
  return (
    <div className="container-page max-w-2xl py-20">
      <StatusRefresher status={order.status} />
      <p className="eyebrow">Commande {order.id}</p>
      <h1 className="mt-4 text-5xl" aria-live="polite">{copy.title}</h1>
      <p className="mt-6 leading-relaxed text-graphite">{copy.body}</p>
      <dl className="card mt-10 space-y-3 p-7 text-sm">
        {lines.map((l) => (
          <div key={l.variantId} className="flex justify-between gap-4">
            <dt>{store.product.brand} {store.product.name} {l.variantName} × {l.quantity}</dt>
            <dd>{formatPrice(l.lineTotal)}</dd>
          </div>
        ))}
        <div className="flex justify-between"><dt>Livraison</dt><dd>{formatPrice(order.shipping)}</dd></div>
        <div className="flex justify-between border-t border-ink/10 pt-3 font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
      </dl>
      {(order.status === "expired" || order.status === "failed") && <Link href="/panier" className="btn btn-primary mt-8">Retour au panier</Link>}
      {(order.status === "paid" || order.status === "needs_review") && (
        <p className="mt-8 text-sm text-steel">
          Vous changez d&apos;avis ? Vous disposez de {store.returns.withdrawalDays} jours après réception : <Link href="/retractation" className="link">se rétracter du contrat</Link>.
        </p>
      )}
    </div>
  );
}
