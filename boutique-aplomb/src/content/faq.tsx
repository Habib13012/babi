import Link from "next/link";
import type { ReactNode } from "react";
import { DemoTag, Missing } from "@/components/ui/Missing";
import type { StoreData } from "@/data/types";
import { formatPrice, formatRange } from "@/lib/format";

export interface FaqItem {
  q: string;
  a: ReactNode;
}

/** Réponses construites à partir des données : elles ne peuvent pas contredire les autres pages. */
export function faqItems(data: StoreData): FaqItem[] {
  const m = data.shipping.methods[0];
  const r = data.returns;
  return [
    {
      q: "Quels ordinateurs sont compatibles ?",
      a: (
        <>
          Les limites de taille et de poids sont indiquées dans les{" "}
          <Link className="link" href={`/produit/${data.product.slug}#caracteristiques`}>
            caractéristiques
          </Link>
          . En cas de doute, écrivez-nous avec le modèle de votre ordinateur avant de commander.
        </>
      ),
    },
    {
      q: "Où livrez-vous et en combien de temps ?",
      a: m ? (
        <>
          Nous livrons en {data.shipping.zoneLabel} uniquement. {m.label} : {formatPrice(m.price.value)}
          {m.price.status === "demo" && <DemoTag />}, expédition sous {formatRange(m.handlingDays.value)} puis {formatRange(m.transitDays.value)} de transport.
        </>
      ) : (
        <Missing>zone, tarif et délai de livraison</Missing>
      ),
    },
    {
      q: "Puis-je retourner le produit ?",
      a: (
        <>
          Oui. Vous disposez de {r.withdrawalDays} jours après réception pour vous rétracter, sans avoir à vous justifier. Nous vous remboursons au plus tard {r.refundDays} jours après
          votre demande (nous pouvons attendre la réception du produit ou la preuve de son expédition).{" "}
          {r.returnShippingPaidBy?.value === "customer"
            ? "Les frais de retour restent à votre charge."
            : r.returnShippingPaidBy?.value === "seller"
              ? "Les frais de retour sont à notre charge."
              : null}{" "}
          <Link className="link" href="/retours">
            Politique de retour
          </Link>
        </>
      ),
    },
    {
      q: "Quels moyens de paiement acceptez-vous ?",
      a: <>{data.payment.methods.join(", ")}. Le paiement est traité par Stripe ; nous n&apos;avons jamais accès à vos numéros de carte.</>,
    },
    {
      q: "Le support soulage-t-il les douleurs de dos ou de nuque ?",
      a: "Socle 01 n'est pas un dispositif médical et ne traite aucune douleur. Il permet de surélever l'écran ; pour toute douleur persistante, consultez un professionnel de santé.",
    },
    {
      q: "Le rendu 3D correspond-il exactement au produit ?",
      a:
        data.product.model.type === "procedural"
          ? "Non. Le modèle 3D est un prototype indicatif qui illustre le principe de fonctionnement. Les photos et les caractéristiques font foi."
          : "Le modèle 3D est fourni par le fabricant. Les caractéristiques écrites font foi en cas de différence.",
    },
    {
      q: "Quelle garantie s'applique ?",
      a: (
        <>
          Vous bénéficiez de la garantie légale de conformité (2 ans à compter de la livraison) et de la garantie contre les vices cachés.{" "}
          {data.product.commercialWarranty ?? "Aucune garantie commerciale supplémentaire n'est proposée."}{" "}
          <Link className="link" href="/cgv#garanties">
            Détails dans les CGV
          </Link>
        </>
      ),
    },
    {
      q: "Comment vous contacter ?",
      a: (
        <>
          Par le{" "}
          <Link className="link" href="/contact">
            formulaire de contact
          </Link>{" "}
          ou par e-mail{data.seller.email ? ` à ${data.seller.email}` : ""}. Nous répondons les jours ouvrés.
        </>
      ),
    },
  ];
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((it) => (
        <details key={it.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
            {it.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="pb-6 pr-12 leading-relaxed text-graphite">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
