/**
 * Modèle de données de la boutique.
 *
 * Règle : toute information commerciale ou juridique inconnue vaut `null`.
 * Elle n'est jamais remplacée par une valeur inventée. Les valeurs de
 * démonstration vivent dans `demo.ts` et sont marquées `status: "demo"`.
 */

export type DataMode = "demo" | "production";

/** Origine d'une valeur affichée au client. */
export type ValueStatus = "confirmed" | "demo";

export interface Sourced<T> {
  value: T;
  status: ValueStatus;
  /** Justificatif (fiche fournisseur, échantillon mesuré, devis…). */
  source?: string;
}

export interface PostalAddress {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Seller {
  /** Nom commercial affiché (marque). */
  tradeName: string;
  /** Dénomination sociale ou nom/prénom de l'entrepreneur individuel. */
  legalName: string | null;
  /** Ex. « Entrepreneur individuel (micro-entreprise) », « SAS ». */
  legalForm: string | null;
  /** Capital social — uniquement pour les sociétés. */
  shareCapital: string | null;
  siren: string | null;
  /** Immatriculation : RCS + ville, ou RNE. */
  registration: string | null;
  vatNumber: string | null;
  /** franchise = « TVA non applicable, art. 293 B du CGI ». */
  vatRegime: "franchise" | "standard" | null;
  address: PostalAddress | null;
  email: string | null;
  phone: string | null;
  publicationDirector: string | null;
  host: { name: string; address: string; phone: string } | null;
  /** Médiateur de la consommation (art. L612-1 C. conso). */
  mediator: { name: string; website: string; address: string } | null;
  /** Identifiant unique REP (emballages) délivré par l'ADEME. */
  packagingUniqueId: string | null;
}

export interface Spec {
  label: string;
  value: string;
  /** true uniquement si la valeur est prouvée (fiche technique, mesure). */
  verified: boolean;
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  /** Couleur utilisée pour le rendu 3D et les pastilles. */
  swatch: string;
  available: boolean;
  /** Stock initial chargé en base au premier démarrage. */
  initialStock: number;
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "photo" = photo réelle autorisée ; "prototype" = rendu indicatif. */
  kind: "photo" | "prototype";
}

export type ProductModel =
  | { type: "procedural" }
  | { type: "gltf"; url: string; verified: boolean };

export interface Product {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  shortDescription: string;
  description: string[];
  /** true quand textes et visuels ont été relus face au produit réel reçu. */
  copyVerified: boolean;
  benefits: { title: string; body: string }[];
  /** Étapes du récit 3D (mêmes exigences d'exactitude que la description). */
  story: { eyebrow: string; title: string; body: string }[];
  audience: string[];
  notFor: string[];
  usageSteps: { title: string; body: string }[];
  /** Prix TTC en centimes. */
  price: Sourced<number> | null;
  currency: "EUR";
  variants: Variant[];
  specs: Spec[];
  boxContents: Spec[];
  notIncluded: string[];
  images: ProductImage[];
  model: ProductModel;
  gtin: string | null;
  mpn: string | null;
  googleProductCategory: string;
  condition: "new";
  /** RGSP (UE 2023/988) : fabricant et personne responsable dans l'UE. */
  manufacturer: { name: string; address: string; contact: string } | null;
  euResponsiblePerson: { name: string; address: string; contact: string } | null;
  safetyInformation: string[] | null;
  countryOfOrigin: string | null;
  /** Garantie commerciale éventuelle (en plus des garanties légales). */
  commercialWarranty: string | null;
}

export interface ShippingMethod {
  id: string;
  label: string;
  carrier: string;
  /** Prix TTC en centimes. */
  price: Sourced<number>;
  handlingDays: Sourced<[number, number]>;
  transitDays: Sourced<[number, number]>;
}

export interface Shipping {
  /** Codes ISO 3166-1 alpha-2. */
  countries: string[];
  zoneLabel: string;
  shipsFrom: { city: string; country: string } | null;
  methods: ShippingMethod[];
}

export interface Returns {
  /** Délai légal de rétractation (14 jours minimum). */
  withdrawalDays: number;
  /** Délai de remboursement après rétractation (14 jours maximum). */
  refundDays: number;
  returnShippingPaidBy: Sourced<"customer" | "seller"> | null;
  /** Estimation du coût de retour à communiquer si à la charge du client. */
  estimatedReturnCost: Sourced<number> | null;
  returnAddress: PostalAddress | null;
}

export interface Payment {
  provider: "Stripe";
  methods: string[];
  maxQuantityPerOrder: number;
}

export interface StoreData {
  mode: DataMode;
  seller: Seller;
  product: Product;
  shipping: Shipping;
  returns: Returns;
  payment: Payment;
  /** Version des CGV acceptées à la commande. */
  termsVersion: string;
  /** true une fois les textes juridiques relus par un professionnel du droit. */
  legalTextsReviewed: boolean;
  legalLastUpdated: string;
}
