import { ConsentSettings } from "@/components/consent/Consent";
import { LegalPage } from "@/components/ui/LegalPage";
import { isDemo } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Cookies", description: "Cookies et stockage local utilisés par le site Aplomb, et gestion de votre consentement.", path: "/cookies", noindex: isDemo });

export default function Page() {
  const ga = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  return (
    <LegalPage title="Cookies" intro="Le site n'utilise par défaut que du stockage strictement nécessaire, exempté de consentement.">
      <h2>Votre choix</h2>
      <div className="not-prose"><ConsentSettings /></div>
      <h2>Liste</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead><tr className="border-b border-ink/15"><th className="py-3 pr-4">Nom</th><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Finalité</th><th className="py-3">Durée</th></tr></thead>
          <tbody>
            <tr className="border-b border-ink/10"><td className="py-3 pr-4">aplomb.cart.v1</td><td className="py-3 pr-4">Stockage local, nécessaire</td><td className="py-3 pr-4">Mémoriser votre panier</td><td className="py-3">Jusqu&apos;à suppression</td></tr>
            <tr className="border-b border-ink/10"><td className="py-3 pr-4">aplomb.consent.v1</td><td className="py-3 pr-4">Stockage local, nécessaire</td><td className="py-3 pr-4">Mémoriser votre choix de consentement</td><td className="py-3">6 mois</td></tr>
            {ga && <tr className="border-b border-ink/10"><td className="py-3 pr-4">_ga, _ga_*</td><td className="py-3 pr-4">Cookie, mesure d&apos;audience</td><td className="py-3 pr-4">Statistiques de fréquentation (Google Analytics), après consentement</td><td className="py-3">13 mois max.</td></tr>}
          </tbody>
        </table>
      </div>
      <p>La page de paiement est hébergée par Stripe, qui dépose ses propres cookies nécessaires à la sécurité du paiement (voir la politique de Stripe).</p>
    </LegalPage>
  );
}
