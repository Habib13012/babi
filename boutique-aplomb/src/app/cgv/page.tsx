import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { Missing } from "@/components/ui/Missing";
import { Address, SellerIdentity } from "@/components/ui/SellerBits";
import { isDemo, store } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: "Conditions générales de vente", description: "Conditions générales de vente de la boutique Aplomb.", path: "/cgv", noindex: isDemo });

export default function Page() {
  const s = store.seller;
  const r = store.returns;
  return (
    <LegalPage title="Conditions générales de vente" intro={<>Version du {store.termsVersion}. Ces conditions s&apos;appliquent aux ventes conclues sur ce site avec des consommateurs résidant en {store.shipping.zoneLabel}.</>}>
      <h2>1. Vendeur</h2>
      <SellerIdentity seller={s} />

      <h2>2. Produit</h2>
      <p>
        Le site propose un produit unique, {store.product.brand} {store.product.name} ({store.product.tagline.toLowerCase()}), dans les finitions indiquées sur la <Link href={`/produit/${store.product.slug}`}>page produit</Link>. Ses caractéristiques
        essentielles, le contenu du colis et les consignes de sécurité y sont décrits. Le modèle 3D et les illustrations sont indicatifs ; les caractéristiques écrites font foi.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises{s.vatRegime === "franchise" ? " (TVA non applicable, art. 293 B du CGI)" : ""}. Les frais de livraison sont indiqués avant la validation de la commande et
        s&apos;ajoutent au prix du produit. Le prix applicable est celui affiché au moment de la commande.
      </p>

      <h2>4. Commande</h2>
      <ol>
        <li>Choix de la finition et de la quantité, ajout au panier.</li>
        <li>Vérification du récapitulatif (produit, prix, frais de livraison, total) et correction éventuelle.</li>
        <li>Acceptation des présentes CGV, puis clic sur le bouton « Commander avec obligation de paiement ».</li>
        <li>Saisie de l&apos;adresse de livraison et paiement sur la page sécurisée de Stripe.</li>
        <li>Le contrat est conclu à la confirmation du paiement. Un e-mail récapitulatif vous est alors envoyé.</li>
      </ol>
      <p>Nous pouvons refuser une commande en cas de litige antérieur de paiement ou de demande anormale ; vous êtes alors intégralement remboursé.</p>

      <h2>5. Paiement</h2>
      <p>
        Le paiement s&apos;effectue par carte bancaire via Stripe Payments Europe, Ltd., au moment de la commande. Les données de carte sont saisies et traitées exclusivement par Stripe (certifié PCI-DSS) ; nous n&apos;y avons pas accès.
      </p>

      <h2>6. Livraison</h2>
      <p>
        Les zones, tarifs et délais sont détaillés sur la page <Link href="/livraison">Livraison</Link>. À défaut de délai indiqué, la livraison intervient au plus tard 30 jours après la conclusion du contrat. Le risque de perte ou
        d&apos;endommagement vous est transféré à la prise de possession physique du produit (article L216-4 du code de la consommation).
      </p>

      <h2 id="retractation">7. Droit de rétractation</h2>
      <p>
        Vous disposez d&apos;un délai de {r.withdrawalDays} jours à compter de la réception du produit pour vous rétracter, sans motif (articles L221-18 et suivants du code de la consommation). Vous pouvez utiliser la{" "}
        <Link href="/retractation">fonction de rétractation en ligne</Link>, le formulaire type ci-dessous ou toute autre déclaration dénuée d&apos;ambiguïté adressée à <Address address={s.address} /> ou par e-mail.
      </p>
      <p>
        Vous renvoyez le produit au plus tard {r.withdrawalDays} jours après votre déclaration, à : <Address address={r.returnAddress} label="adresse de retour" />.{" "}
        {r.returnShippingPaidBy?.value === "seller" ? "Les frais de renvoi sont à notre charge." : r.returnShippingPaidBy?.value === "customer" ? "Les frais directs de renvoi sont à votre charge." : <Missing>prise en charge des frais de retour</Missing>}
      </p>
      <p>
        Nous remboursons toutes les sommes versées, y compris les frais de livraison initiaux au tarif standard, au plus tard {r.refundDays} jours après réception de votre déclaration, par le même moyen de paiement. Le remboursement
        peut être différé jusqu&apos;à récupération du produit ou preuve de son expédition. Votre responsabilité n&apos;est engagée qu&apos;en cas de dépréciation résultant de manipulations autres que celles nécessaires pour établir la
        nature, les caractéristiques et le bon fonctionnement du produit.
      </p>

      <h2 id="garanties">8. Garanties légales</h2>
      <div className="rounded-2xl border border-ink/15 p-5 text-sm">
        <p>
          Le consommateur dispose d&apos;un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de conformité en cas d&apos;apparition d&apos;un défaut de conformité. Durant ce délai, le
          consommateur n&apos;est tenu d&apos;établir que l&apos;existence du défaut de conformité et non la date d&apos;apparition de celui-ci.
        </p>
        <p>
          La garantie légale de conformité donne au consommateur droit à la réparation ou au remplacement du bien dans un délai de trente jours suivant sa demande, sans frais et sans inconvénient majeur pour lui. Si le bien est réparé
          dans le cadre de la garantie légale de conformité, le consommateur bénéficie d&apos;une extension de six mois de la garantie initiale. Si le consommateur demande la réparation du bien, mais que le vendeur impose le
          remplacement, la garantie légale de conformité est renouvelée pour une période de deux ans à compter de la date de remplacement du bien.
        </p>
        <p>
          Le consommateur peut obtenir une réduction du prix d&apos;achat en conservant le bien ou mettre fin au contrat en se faisant rembourser intégralement contre restitution du bien, si : 1° le professionnel refuse de réparer ou
          de remplacer le bien ; 2° la réparation ou le remplacement du bien intervient après un délai de trente jours ; 3° la réparation ou le remplacement du bien occasionne un inconvénient majeur pour le consommateur ; 4° la
          non-conformité du bien persiste en dépit de la tentative de mise en conformité du vendeur restée infructueuse. Le consommateur a également droit à une réduction du prix ou à la résolution du contrat lorsque le défaut de
          conformité est si grave qu&apos;il justifie que la réduction du prix ou la résolution du contrat soit immédiate. Le consommateur n&apos;a pas droit à la résolution de la vente si le défaut de conformité est mineur.
        </p>
        <p>
          Toute période d&apos;immobilisation du bien en vue de sa réparation ou de son remplacement suspend la garantie qui restait à courir jusqu&apos;à la délivrance du bien remis en état. Ces droits résultent des articles L217-1
          à L217-32 du code de la consommation. Le vendeur qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt une amende civile d&apos;un montant maximal de 300 000 euros, qui peut être
          porté jusqu&apos;à 10 % du chiffre d&apos;affaires moyen annuel (article L241-5 du code de la consommation).
        </p>
        <p>
          Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles 1641 à 1649 du code civil, pendant une durée de deux ans à compter de la découverte du défaut. Cette garantie donne
          droit à une réduction de prix si le bien est conservé ou à un remboursement intégral contre restitution du bien.
        </p>
      </div>
      <p>{store.product.commercialWarranty ?? "Aucune garantie commerciale n'est proposée en plus des garanties légales."}</p>

      <h2>9. Service client et réclamations</h2>
      <p>
        Pour toute question ou réclamation : <Link href="/contact">formulaire de contact</Link>, e-mail {s.email ?? <Missing>e-mail</Missing>} ou téléphone {s.phone ?? <Missing>téléphone</Missing>}.
      </p>

      <h2>10. Médiation</h2>
      <p>
        En cas de litige non résolu par notre service client, vous pouvez recourir gratuitement au médiateur de la consommation :{" "}
        {s.mediator ? `${s.mediator.name}, ${s.mediator.address}, ${s.mediator.website}` : <Missing>nom, adresse et site du médiateur de la consommation</Missing>}. Une réclamation écrite préalable auprès de nous est requise.
      </p>

      <h2>11. Données personnelles</h2>
      <p>
        Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>12. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. Vous bénéficiez en tout état de cause des dispositions impératives de la loi de votre pays de résidence. En cas de litige, les tribunaux compétents sont ceux désignés
        par les règles de droit commun.
      </p>

      <h2 id="annexe">Annexe — Formulaire type de rétractation</h2>
      <div className="rounded-2xl border border-ink/15 p-5 text-sm">
        <p>(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.)</p>
        <p>
          À l&apos;attention de {s.legalName ?? s.tradeName}, <Address address={s.address} />, {s.email ?? <Missing>e-mail</Missing>} :
        </p>
        <p>Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*) ci-dessous :</p>
        <p>Commandé le (*)/reçu le (*) :<br />Nom du (des) consommateur(s) :<br />Adresse du (des) consommateur(s) :<br />Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :<br />Date :</p>
        <p>(*) Rayez la mention inutile.</p>
      </div>
    </LegalPage>
  );
}
