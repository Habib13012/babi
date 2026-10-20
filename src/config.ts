/**
 * Configuration centrale du site.
 * Tout ce qui est propre à la boutique et aux fichiers médias se règle ici.
 */
export const site = {
  title: 'Mon enfant et les écrans',
  author: 'Habib Tahrat',
  price: '14,90 €',

  /**
   * Lien du bouton d'achat.
   * À REMPLACER par l'URL exacte de la fiche produit Shopify
   * (ex. https://votre-boutique.com/products/mon-enfant-et-les-ecrans),
   * ou par un lien panier direct : https://votre-boutique.com/cart/<VARIANT_ID>:1
   */
  buyUrl: 'https://icgsr-19.myshopify.com/',
}

/** Fichiers médias — voir README.md pour le format attendu de chacun. */
export const media = {
  /** Couverture à plat, utilisée comme texture du livre 3D. */
  coverFront: '/images/product/cover-front.jpg',
  /** Mockup détouré (PNG transparent) — affiché si la 3D n'est pas disponible. */
  mockup: '/images/product/book-mockup.png',
  sceneFamille: '/images/scenes/scene-famille.jpg',
  detailTablette: '/images/scenes/detail-tablette.jpg',
}
