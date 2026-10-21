import type { StoreData } from "@/data/types";

/**
 * Liste des informations qui empêchent la mise en production.
 * Utilisée par `npm run check:launch`, le build en mode production,
 * l'endpoint de paiement et la checklist Merchant Center.
 */

export interface Blocker {
  id: string;
  area: "vendeur" | "produit" | "prix" | "livraison" | "retours" | "technique";
  label: string;
  howTo: string;
}

type Env = Record<string, string | undefined>;

export function getLaunchBlockers(data: StoreData, env: Env = process.env): Blocker[] {
  const b: Blocker[] = [];
  const add = (id: string, area: Blocker["area"], label: string, howTo: string) => b.push({ id, area, label, howTo });
  const s = data.seller;
  const p = data.product;

  if (data.mode !== "production") add("mode", "technique", "Le site fonctionne avec les données de démonstration", "Définir STORE_DATA_MODE=production après avoir complété src/data/production.ts.");

  // Vendeur
  if (!data.legalTextsReviewed) add("legal.reviewed", "vendeur", "Textes juridiques non relus par un professionnel", "Faire valider CGV, mentions légales et politique de confidentialité (avocat, juriste, fédération e-commerce), puis legalTextsReviewed: true.");
  if (!s.legalName) add("seller.legalName", "vendeur", "Dénomination sociale ou nom de l'entrepreneur", "Reporter le nom exact figurant sur l'avis de situation INSEE / extrait Kbis.");
  if (!s.legalForm) add("seller.legalForm", "vendeur", "Forme juridique", "Ex. « Entrepreneur individuel » ou « SAS au capital de … € ».");
  if (!s.siren) add("seller.siren", "vendeur", "Numéro SIREN", "Créer l'entreprise sur formalites.entreprises.gouv.fr puis reporter le SIREN attribué.");
  if (!s.registration) add("seller.registration", "vendeur", "Immatriculation (RCS ou RNE)", "Indiquer « RCS Ville n° … » ou « Immatriculée au RNE ».");
  if (!s.vatRegime) add("seller.vatRegime", "vendeur", "Régime de TVA", "« franchise » (art. 293 B du CGI) ou « standard » — confirmer avec votre expert-comptable.");
  if (s.vatRegime === "standard" && !s.vatNumber) add("seller.vatNumber", "vendeur", "Numéro de TVA intracommunautaire", "Disponible sur l'espace professionnel impots.gouv.fr.");
  if (!s.address) add("seller.address", "vendeur", "Adresse postale du vendeur", "Adresse réelle de l'établissement (une domiciliation déclarée est acceptée).");
  if (!s.email) add("seller.email", "vendeur", "Adresse e-mail de contact", "Créer une adresse sur le domaine de la boutique et vérifier qu'elle reçoit les messages.");
  if (!s.phone) add("seller.phone", "vendeur", "Numéro de téléphone", "Requis par la LCEN ; utiliser une ligne réellement joignable.");
  if (!s.publicationDirector) add("seller.publicationDirector", "vendeur", "Directeur de la publication", "En général le dirigeant ou l'entrepreneur individuel.");
  if (!s.host) add("seller.host", "vendeur", "Hébergeur du site", "Nom, adresse et téléphone de l'hébergeur choisi (ex. fournisseur cloud).");
  if (!s.mediator) add("seller.mediator", "vendeur", "Médiateur de la consommation", "Adhérer à un médiateur référencé par la CECMC (economie.gouv.fr/mediation-conso).");
  if (!s.packagingUniqueId) add("seller.packagingUniqueId", "vendeur", "Identifiant unique REP emballages", "Vérifier l'obligation et adhérer à un éco-organisme emballages (ex. Citeo, Léko) pour obtenir l'IDU.");

  // Produit
  if (!p.copyVerified) add("product.copyVerified", "produit", "Textes produit relus face à l'échantillon réel", "Recevoir un échantillon, vérifier chaque phrase, puis passer copyVerified à true.");
  if (p.specs.length === 0) add("product.specs", "produit", "Caractéristiques techniques", "Reporter la fiche technique fournisseur (matériau, dimensions, poids, charge, compatibilité).");
  for (const spec of p.specs) if (!spec.verified) add(`product.spec.${spec.label}`, "produit", `Caractéristique non vérifiée : ${spec.label}`, "Mesurer sur échantillon ou obtenir la fiche technique signée, puis verified: true.");
  if (p.boxContents.length === 0) add("product.boxContents", "produit", "Contenu du colis", "Lister exactement ce que contient le colis expédié.");
  for (const item of p.boxContents) if (!item.verified) add(`product.box.${item.label}`, "produit", `Contenu du colis non vérifié : ${item.label}`, "Vérifier sur un colis réel.");
  if (!p.images.some((i) => i.kind === "photo")) add("product.images", "produit", "Photos réelles du produit", "Photographier le produit réel ou obtenir des photos avec autorisation écrite du fabricant ; fond neutre, sans texte ni filigrane.");
  // Le prototype procédural reste autorisé : il est toujours affiché avec la mention « rendu indicatif, non contractuel ».
  if (p.model.type === "gltf" && !p.model.verified) add("product.model.verified", "produit", "Modèle 3D non vérifié", "Comparer le modèle avec le produit réel avant de le présenter comme fidèle.");
  if (!p.gtin && !p.mpn) add("product.identifiers", "produit", "Identifiant produit (GTIN ou MPN)", "Produit de marque propre sans GTIN : définir au minimum un MPN ; acheter des GTIN auprès de GS1 France si vous souhaitez en attribuer.");
  if (!p.manufacturer) add("product.manufacturer", "produit", "Fabricant (RGSP)", "Nom, adresse postale et contact du fabricant (règlement UE 2023/988).");
  if (!p.euResponsiblePerson) add("product.euResponsiblePerson", "produit", "Personne responsable dans l'UE (RGSP)", "Obligatoire si le fabricant est hors UE : importateur ou mandataire établi dans l'UE.");
  if (!p.safetyInformation) add("product.safetyInformation", "produit", "Avertissements et consignes de sécurité", "Reprendre la notice du fabricant (charge maximale, pincement des articulations…).");
  if (!p.countryOfOrigin) add("product.countryOfOrigin", "produit", "Pays de fabrication", "Indiqué sur la facture fournisseur / le certificat d'origine.");

  // Prix et stock
  if (!p.price) add("product.price", "prix", "Prix de vente TTC", "Fixer le prix à partir du coût de revient réel (achat, transport, droits, emballage, frais de paiement).");
  else if (p.price.status !== "confirmed") add("product.price.status", "prix", "Prix encore en démonstration", "Confirmer le prix définitif puis status: \"confirmed\".");
  if (!p.variants.some((v) => v.available)) add("product.variants", "prix", "Aucune variante disponible", "Activer uniquement les variantes réellement en stock.");
  for (const v of p.variants) if (v.available && v.initialStock <= 0) add(`product.stock.${v.id}`, "prix", `Stock non renseigné : ${v.name}`, "Saisir le stock réellement reçu.");

  // Livraison
  if (!data.shipping.shipsFrom) add("shipping.shipsFrom", "livraison", "Lieu d'expédition", "Ville et pays réels d'où partent les colis (votre adresse, un entrepôt logistique…).");
  if (data.shipping.methods.length === 0) add("shipping.methods", "livraison", "Mode de livraison", "Tarif et délais réels du transporteur choisi (contrat ou grille publique).");
  for (const m of data.shipping.methods) {
    if (m.price.status !== "confirmed" || m.handlingDays.status !== "confirmed" || m.transitDays.status !== "confirmed") {
      add(`shipping.${m.id}`, "livraison", `Tarif ou délais de « ${m.label} » non confirmés`, "Confirmer tarif, délai de préparation et délai de transport, puis status: \"confirmed\".");
    }
  }

  // Retours
  if (!data.returns.returnShippingPaidBy || data.returns.returnShippingPaidBy.status !== "confirmed") add("returns.paidBy", "retours", "Prise en charge des frais de retour", "Décider qui paie le retour ; si c'est le client, l'indiquer clairement avec une estimation du coût.");
  if (data.returns.returnShippingPaidBy?.value === "customer" && data.returns.estimatedReturnCost?.status !== "confirmed") add("returns.estimatedCost", "retours", "Estimation du coût de retour", "Indiquer le coût approximatif d'un retour au tarif du transporteur.");
  if (!data.returns.returnAddress) add("returns.address", "retours", "Adresse de retour", "Adresse réelle de réception des retours.");

  // Technique
  const site = env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!site.startsWith("https://")) add("env.siteUrl", "technique", "URL publique HTTPS", "Définir NEXT_PUBLIC_SITE_URL=https://votre-domaine.");
  if (!env.STRIPE_SECRET_KEY) add("env.stripe", "technique", "Clé secrète Stripe", "Créer le compte Stripe, valider l'identité, puis définir STRIPE_SECRET_KEY.");
  if (!env.STRIPE_WEBHOOK_SECRET) add("env.stripeWebhook", "technique", "Secret du webhook Stripe", "Créer le endpoint /api/webhooks/stripe dans Stripe et reporter le secret whsec_….");
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) add("env.email", "technique", "Envoi des e-mails transactionnels", "Configurer RESEND_API_KEY et EMAIL_FROM (domaine vérifié SPF/DKIM).");
  if (!env.SELLER_NOTIFICATION_EMAIL) add("env.sellerEmail", "technique", "E-mail de réception vendeur", "Définir SELLER_NOTIFICATION_EMAIL pour recevoir commandes, contacts et rétractations.");

  return b;
}

export function isLaunchReady(data: StoreData, env?: Env): boolean {
  return getLaunchBlockers(data, env).length === 0;
}
