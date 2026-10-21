import Link from "next/link";

/** Bandeau permanent en mode démonstration : aucune donnée affichée n'est contractuelle. */
export function DemoBanner() {
  return (
    <div className="bg-warn-bg text-warn" role="note">
      <p className="container-page py-2 text-center text-xs font-semibold leading-relaxed">
        Site en préparation — données de démonstration, aucune vente réelle. Paiement en mode test uniquement.{" "}
        <Link href="/a-propos#etat-du-projet" className="underline underline-offset-2">
          En savoir plus
        </Link>
      </p>
    </div>
  );
}
