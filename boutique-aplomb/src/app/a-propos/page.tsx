import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Val } from "@/components/ui/Missing";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "À propos", description: "Aplomb, marque indépendante d'un seul objet : le support Socle 01.", path: "/a-propos", noindex: isDemo });

export default function Page() {
  const p = store.product;
  return (
    <div className="container-page py-14 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-graphite/85">
          <p className="eyebrow">À propos</p>
          <h1 className="text-5xl text-ink md:text-6xl">Un seul objet, bien expliqué.</h1>
          <p>
            Aplomb est une marque indépendante qui ne vend qu&apos;un produit : {p.brand} {p.name}, un support d&apos;ordinateur portable. Le nom vient de l&apos;expression « d&apos;aplomb » : à la verticale, bien posé.
          </p>
          <p>
            Nous ne fabriquons pas nous-mêmes : Socle 01 est produit par un fabricant tiers, sélectionné sur échantillon. Son identité est indiquée sur la{" "}
            <Link className="link" href={`/produit/${p.slug}`}>page produit</Link>. Nous assurons la sélection, le contrôle, la vente, l&apos;expédition et le service après-vente.
          </p>
          <p>
            Notre engagement : tout ce qui est écrit sur ce site doit être vérifiable. Pas de faux avis, pas de prix barré, pas de compte à rebours, et des frais affichés avant le paiement.
          </p>
          <p>
            Vendeur : <Val value={store.seller.legalName} label="identité du vendeur" />. <Link className="link" href="/mentions-legales">Mentions légales</Link>.
          </p>
        </div>
        <div className="card grid aspect-square place-items-center">
          <Logo variant="mark" className="h-1/2 w-1/2" />
        </div>
      </div>
      {isDemo && (
        <section id="etat-du-projet" className="mt-20 max-w-3xl scroll-mt-28 rounded-[1.5rem] bg-warn-bg p-8 text-warn">
          <h2 className="font-sans text-xl font-semibold">État du projet</h2>
          <p className="mt-3 leading-relaxed">
            Cette boutique est en préparation. Le prix, le stock et les tarifs de livraison affichés sont des valeurs de démonstration. Les caractéristiques marquées « à confirmer » sont des objectifs de sourcing et non des mesures. Le
            modèle 3D est un prototype indicatif. Aucune commande réelle ne peut être passée.
          </p>
        </section>
      )}
    </div>
  );
}
