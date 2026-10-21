import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { DemoTag, Missing } from "@/components/ui/Missing";
import { isDemo, store } from "@/data";
import { formatPrice, formatRange } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Livraison", description: "Zones, tarifs, délais et lieu d'expédition des commandes Aplomb.", path: "/livraison", noindex: isDemo });

export default function Page() {
  const sh = store.shipping;
  return (
    <LegalPage title="Livraison" intro="Tarifs et délais affichés avant la commande, identiques à ceux appliqués au paiement.">
      <h2>Zone desservie</h2>
      <p>
        Nous livrons uniquement en <strong>{sh.zoneLabel}</strong>. Les autres destinations (y compris outre-mer et étranger) ne sont pas proposées pour le moment.
      </p>
      <h2>Lieu d&apos;expédition</h2>
      <p>{sh.shipsFrom ? `Les colis sont expédiés depuis ${sh.shipsFrom.city} (${sh.shipsFrom.country}).` : <Missing>ville et pays d&apos;expédition réels</Missing>}</p>
      <h2>Tarifs et délais</h2>
      {sh.methods.length === 0 ? (
        <p><Missing>modes, tarifs et délais de livraison</Missing></p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15">
              <th className="py-3 pr-4">Mode</th>
              <th className="py-3 pr-4">Tarif TTC</th>
              <th className="py-3 pr-4">Préparation</th>
              <th className="py-3">Transport</th>
            </tr>
          </thead>
          <tbody>
            {sh.methods.map((m) => (
              <tr key={m.id} className="border-b border-ink/10 align-top">
                <td className="py-3 pr-4">{m.label}<br /><span className="text-steel">{m.carrier}</span></td>
                <td className="py-3 pr-4">{formatPrice(m.price.value)}{m.price.status === "demo" && <DemoTag />}</td>
                <td className="py-3 pr-4">{formatRange(m.handlingDays.value)}{m.handlingDays.status === "demo" && <DemoTag />}</td>
                <td className="py-3">{formatRange(m.transitDays.value)}{m.transitDays.status === "demo" && <DemoTag />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>
        Le tarif de livraison est forfaitaire par commande et s&apos;ajoute au prix du produit ; il est affiché dans le panier avant le paiement. Aucun frais de douane n&apos;est dû pour une livraison en France. La commande est
        expédiée dans le délai de préparation indiqué après confirmation du paiement ; un numéro de suivi vous est communiqué par e-mail.
      </p>
      <p>
        À défaut d&apos;indication contraire, la livraison intervient au plus tard 30 jours après la commande (article L216-1 du code de la consommation). En cas de retard, vous pouvez nous mettre en demeure de livrer dans un délai
        raisonnable, puis résoudre la vente si la livraison n&apos;intervient pas.
      </p>
      <h2>À la réception</h2>
      <p>
        Vérifiez l&apos;état du colis en présence du livreur si possible. En cas de dommage ou de produit manquant, indiquez des réserves précises au transporteur et <Link href="/contact">contactez-nous</Link> : vos garanties légales
        s&apos;appliquent dans tous les cas.
      </p>
    </LegalPage>
  );
}
