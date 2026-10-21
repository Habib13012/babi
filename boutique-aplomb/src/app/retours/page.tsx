import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { DemoTag, Missing } from "@/components/ui/Missing";
import { Address } from "@/components/ui/SellerBits";
import { isDemo, store } from "@/data";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Retours et remboursements", description: "Droit de rétractation, retours et remboursements Aplomb.", path: "/retours", noindex: isDemo });

export default function Page() {
  const r = store.returns;
  return (
    <LegalPage title="Retours et remboursements">
      <h2>Changer d&apos;avis : {r.withdrawalDays} jours</h2>
      <p>
        Vous disposez de <strong>{r.withdrawalDays} jours</strong> à compter de la réception du produit pour exercer votre droit de rétractation, sans avoir à vous justifier. Pour une commande de plusieurs articles livrés
        séparément, le délai court à partir de la réception du dernier article.
      </p>
      <h2>Comment faire</h2>
      <ol>
        <li>
          Déclarez votre rétractation via notre <Link href="/retractation">fonction de rétractation en ligne</Link>, par e-mail, ou par courrier (formulaire type en annexe des <Link href="/cgv#annexe">CGV</Link>). Vous recevez un accusé de réception.
        </li>
        <li>
          Renvoyez le produit au plus tard {r.withdrawalDays} jours après votre déclaration, à l&apos;adresse : <Address address={r.returnAddress} label="adresse de retour" />.
        </li>
        <li>Nous vous remboursons dans les conditions ci-dessous.</li>
      </ol>
      <h2>Frais de retour</h2>
      <p>
        {r.returnShippingPaidBy ? (
          r.returnShippingPaidBy.value === "customer" ? (
            <>
              Les frais de renvoi sont <strong>à votre charge</strong>
              {r.estimatedReturnCost && (
                <>
                  {" "}— à titre indicatif, environ {formatPrice(r.estimatedReturnCost.value)} pour un envoi suivi en France métropolitaine
                  {r.estimatedReturnCost.status === "demo" && <DemoTag />}
                </>
              )}
              .
            </>
          ) : (
            <>Les frais de renvoi sont <strong>à notre charge</strong> : nous vous fournissons une étiquette prépayée.</>
          )
        ) : (
          <Missing>prise en charge des frais de retour</Missing>
        )}
        {r.returnShippingPaidBy?.status === "demo" && <DemoTag />}
      </p>
      <h2>Remboursement</h2>
      <p>
        Nous remboursons la totalité des sommes versées, <strong>frais de livraison initiaux inclus</strong> (au tarif standard proposé), au plus tard {r.refundDays} jours après réception de votre rétractation, avec le même moyen de
        paiement. Nous pouvons différer le remboursement jusqu&apos;à réception du produit ou jusqu&apos;à ce que vous ayez fourni une preuve d&apos;expédition, selon la date la plus proche.
      </p>
      <p>
        Le produit doit être renvoyé complet. Votre responsabilité n&apos;est engagée qu&apos;en cas de dépréciation résultant de manipulations autres que celles nécessaires pour établir sa nature, ses caractéristiques et son bon fonctionnement.
      </p>
      <h2>Produit défectueux ou non conforme</h2>
      <p>
        Indépendamment du droit de rétractation, la garantie légale de conformité (2 ans) et la garantie des vices cachés s&apos;appliquent. Dans ce cas, les frais de retour sont à notre charge. <Link href="/contact">Contactez-nous</Link> avec
        votre numéro de commande et une photo du défaut. Voir l&apos;article « Garanties » des <Link href="/cgv#garanties">CGV</Link>.
      </p>
    </LegalPage>
  );
}
