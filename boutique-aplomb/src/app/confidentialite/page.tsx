import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { Val } from "@/components/ui/Missing";
import { Address } from "@/components/ui/SellerBits";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Politique de confidentialité", description: "Données personnelles traitées par Aplomb et vos droits.", path: "/confidentialite", noindex: isDemo });

const ROWS = [
  ["Gestion des commandes, livraison, facturation", "Nom, e-mail, adresse de livraison, contenu et montant de la commande", "Exécution du contrat", "Durée de la relation commerciale, puis 10 ans pour les pièces comptables (art. L123-22 C. com.)"],
  ["Paiement et prévention de la fraude", "Données de paiement saisies chez Stripe (nous ne recevons pas le numéro de carte)", "Exécution du contrat, intérêt légitime", "Selon la politique de Stripe"],
  ["Réponse aux demandes de contact", "Nom, e-mail, numéro de commande, message", "Intérêt légitime / mesures précontractuelles", "3 ans après le dernier échange"],
  ["Gestion des rétractations et garanties", "Nom, e-mail, numéro de commande, articles", "Obligation légale", "Durée des garanties légales + 5 ans (prescription)"],
  ["Mesure d'audience (uniquement si vous l'acceptez)", "Pages vues, identifiant de cookie, données techniques", "Consentement", "13 mois maximum pour les cookies"],
];

export default function Page() {
  const s = store.seller;
  return (
    <LegalPage title="Politique de confidentialité" intro="Nous ne collectons que les données nécessaires à votre commande. Elles ne sont ni vendues ni louées.">
      <h2>Responsable du traitement</h2>
      <p>
        <Val value={s.legalName} label="identité du vendeur" /> ({s.tradeName}), <Address address={s.address} />. Contact : <Val value={s.email} label="e-mail" />.
      </p>
      <h2>Traitements</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead><tr className="border-b border-ink/15"><th className="py-3 pr-4">Finalité</th><th className="py-3 pr-4">Données</th><th className="py-3 pr-4">Base légale</th><th className="py-3">Conservation</th></tr></thead>
          <tbody>{ROWS.map((r) => <tr key={r[0]} className="border-b border-ink/10 align-top">{r.map((c) => <td key={c} className="py-3 pr-4">{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <h2>Destinataires et sous-traitants</h2>
      <ul>
        <li><strong>Stripe</strong> (Stripe Payments Europe, Ltd., Irlande) — paiement par carte.</li>
        <li><strong>Resend</strong> (Resend, Inc., États-Unis) — envoi des e-mails transactionnels. Transfert encadré par le Data Privacy Framework UE–États-Unis et/ou des clauses contractuelles types (à vérifier dans le contrat du prestataire).</li>
        <li><strong>Hébergeur</strong> — {s.host ? s.host.name : <Val value={null} label="hébergeur" />}.</li>
        <li><strong>Transporteur</strong> — {store.shipping.methods[0]?.carrier ?? <Val value={null} label="transporteur" />} : nom et adresse de livraison.</li>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <li><strong>Google Analytics</strong> (Google Ireland Ltd.) — uniquement après consentement.</li>}
      </ul>
      <h2>Vos droits</h2>
      <p>
        Vous disposez des droits d&apos;accès, de rectification, d&apos;effacement, de limitation, de portabilité et d&apos;opposition, ainsi que du droit de définir des directives relatives au sort de vos données après votre décès.
        Écrivez-nous via la page <Link href="/contact">Contact</Link>. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>
      <h2>Cookies et stockage local</h2>
      <p>Voir la page <Link href="/cookies">Cookies</Link>.</p>
    </LegalPage>
  );
}
