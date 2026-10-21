import type { StoreData } from "./types";

/**
 * DONNÉES DE PRODUCTION — seules valeurs autorisées sur le site public.
 *
 * Tout ce qui vaut `null` est inconnu et bloque la mise en production
 * (voir `npm run check:launch` et docs/GOOGLE-MERCHANT-CHECKLIST.md).
 * Ne remplissez un champ qu'avec une information réelle et vérifiable.
 */
export const productionData: StoreData = {
  mode: "production",
  termsVersion: "2026-10-21",
  legalTextsReviewed: false,
  legalLastUpdated: "21 octobre 2026",

  seller: {
    tradeName: "Aplomb",
    legalName: null,
    legalForm: null,
    shareCapital: null,
    siren: null,
    registration: null,
    vatNumber: null,
    vatRegime: null,
    address: null,
    email: null,
    phone: null,
    publicationDirector: null,
    host: null,
    mediator: null,
    packagingUniqueId: null,
  },

  product: {
    slug: "socle-01",
    name: "Socle 01",
    brand: "Aplomb",
    tagline: "Support d'ordinateur portable en aluminium",
    shortDescription:
      "Un support pliable en aluminium qui surélève l'écran de votre ordinateur portable pour le rapprocher de la hauteur des yeux.",
    description: [
      "Socle 01 surélève votre ordinateur portable et incline le clavier. L'écran remonte vers la hauteur du regard, ce qui permet de travailler la tête plus droite qu'avec un portable posé à plat sur le bureau.",
      "Il se règle à plusieurs hauteurs grâce à deux articulations, puis se replie à plat pour être rangé ou glissé dans un sac. Des patins antidérapants protègent le bureau et maintiennent l'ordinateur en place.",
      "Pour une utilisation prolongée en position surélevée, un clavier et une souris séparés sont recommandés (non inclus).",
    ],
    // Texte rédigé pour le produit visé : à relire face à l'échantillon réel.
    copyVerified: false,
    benefits: [
      {
        title: "L'écran plus haut",
        body: "Plusieurs hauteurs pour rapprocher le haut de l'écran de la ligne des yeux, selon votre taille et votre siège.",
      },
      {
        title: "Repliable",
        body: "Les deux articulations se referment : le support se range à plat dans un tiroir ou une housse.",
      },
      {
        title: "Ouvert à l'air",
        body: "Le plateau ajouré laisse circuler l'air sous l'ordinateur. Ce n'est pas un système de refroidissement actif.",
      },
    ],
    story: [
      {
        eyebrow: "01 — Replié",
        title: "À plat quand vous partez.",
        body: "Les deux articulations se referment l'une sur l'autre : le support se range à plat dans un tiroir, une housse ou un sac.",
      },
      {
        eyebrow: "02 — Articulations",
        title: "Une hauteur pour chaque bureau.",
        body: "Le bras avant et le plateau se règlent indépendamment pour rapprocher le haut de l'écran de la ligne des yeux.",
      },
      {
        eyebrow: "03 — Plateau ajouré",
        title: "L'air passe dessous.",
        body: "Les lames du plateau laissent circuler l'air sous l'ordinateur. Aucun ventilateur : c'est une ventilation passive.",
      },
      {
        eyebrow: "04 — Patins",
        title: "Il reste en place.",
        body: "Des patins antidérapants sous la base et sur le plateau limitent le glissement et protègent les surfaces.",
      },
    ],
    audience: [
      "Vous travaillez plusieurs heures par jour sur un ordinateur portable.",
      "Vous alternez bureau, domicile et espace partagé et voulez un support transportable.",
      "Vous utilisez déjà, ou prévoyez, un clavier et une souris séparés.",
    ],
    notFor: [
      "Les ordinateurs dont le poids ou la taille dépassent les limites indiquées dans les caractéristiques.",
      "Un usage comme dispositif médical : Socle 01 ne traite ni ne prévient aucune pathologie.",
    ],
    usageSteps: [
      { title: "Dépliez", body: "Ouvrez la base puis le plateau jusqu'au cran souhaité." },
      { title: "Posez", body: "Placez l'ordinateur contre la butée avant du plateau." },
      { title: "Ajustez", body: "Réglez la hauteur pour que le haut de l'écran arrive à hauteur des yeux." },
      { title: "Repliez", body: "Refermez les deux articulations pour le ranger à plat." },
    ],
    price: null,
    currency: "EUR",
    variants: [
      { id: "argent", name: "Argent", sku: "APL-S01-AR", swatch: "#C9CCD1", available: false, initialStock: 0 },
      { id: "graphite", name: "Graphite", sku: "APL-S01-GR", swatch: "#4A4D52", available: false, initialStock: 0 },
    ],
    // Caractéristiques réelles : à reporter depuis la fiche technique du
    // fournisseur ET à contrôler sur un échantillon, puis verified: true.
    specs: [],
    boxContents: [],
    notIncluded: ["Ordinateur portable", "Clavier", "Souris"],
    images: [],
    model: { type: "procedural" },
    gtin: null,
    mpn: null,
    googleProductCategory: "Electronics > Electronics Accessories > Computer Accessories > Computer Risers & Stands",
    condition: "new",
    manufacturer: null,
    euResponsiblePerson: null,
    safetyInformation: null,
    countryOfOrigin: null,
    commercialWarranty: null,
  },

  shipping: {
    countries: ["FR"],
    zoneLabel: "France métropolitaine",
    shipsFrom: null,
    methods: [],
  },

  returns: {
    withdrawalDays: 14,
    refundDays: 14,
    returnShippingPaidBy: null,
    estimatedReturnCost: null,
    returnAddress: null,
  },

  payment: {
    provider: "Stripe",
    methods: ["Carte bancaire (paiement sécurisé par Stripe)"],
    maxQuantityPerOrder: 5,
  },
};
