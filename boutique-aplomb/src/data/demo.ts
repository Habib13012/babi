import { productionData } from "./production";
import type { StoreData } from "./types";

/**
 * DONNÉES DE DÉMONSTRATION — jamais publiées.
 *
 * Elles complètent les données de production pour faire fonctionner le
 * parcours en développement (prix, stock, livraison). Chaque valeur est
 * marquée `status: "demo"` et affichée avec un badge « démo ».
 *
 * L'identité juridique du vendeur n'est PAS simulée : elle reste vide
 * et apparaît comme « à compléter », même en démonstration.
 *
 * Les caractéristiques ci-dessous constituent un cahier des charges cible
 * pour le sourcing, pas des mesures : elles restent `verified: false`.
 */
const p = productionData.product;

export const demoData: StoreData = {
  ...productionData,
  mode: "demo",
  product: {
    ...p,
    price: { value: 6900, status: "demo" },
    variants: p.variants.map((v) => ({ ...v, available: true, initialStock: 20 })),
    specs: [
      { label: "Matériau", value: "Alliage d'aluminium anodisé (cible)", verified: false },
      { label: "Dimensions plié", value: "≈ 26 × 22 × 2 cm (cible)", verified: false },
      { label: "Hauteur réglable", value: "≈ 5 à 18 cm (cible)", verified: false },
      { label: "Poids du support", value: "≈ 900 g (cible)", verified: false },
      { label: "Compatibilité", value: "Ordinateurs de 11 à 16 pouces (cible)", verified: false },
      { label: "Charge maximale", value: "À définir avec le fabricant (test de charge)", verified: false },
      { label: "Patins", value: "Silicone antidérapant (cible)", verified: false },
    ],
    boxContents: [
      { label: "Support Socle 01", value: "1", verified: false },
      { label: "Housse de rangement", value: "1 (à confirmer)", verified: false },
      { label: "Notice d'utilisation et de sécurité (FR)", value: "1", verified: false },
    ],
  },
  shipping: {
    ...productionData.shipping,
    methods: [
      {
        id: "colissimo-domicile",
        label: "Livraison à domicile suivie",
        carrier: "Colissimo (à confirmer)",
        price: { value: 590, status: "demo" },
        handlingDays: { value: [1, 2], status: "demo" },
        transitDays: { value: [2, 3], status: "demo" },
      },
    ],
  },
  returns: {
    ...productionData.returns,
    returnShippingPaidBy: { value: "customer", status: "demo" },
    estimatedReturnCost: { value: 690, status: "demo" },
  },
};
