import { asset, shop } from './lib/runtime'

/**
 * Configuration centrale du site.
 * Sur Shopify, le titre, le prix et le lien d'achat viennent du produit choisi dans l'éditeur de thème.
 */
export const site = {
  /** Nom de la boutique (modifiable dans l'éditeur de thème Shopify). */
  brand: shop.brand || 'Parents Sereins',
  title: 'Mon enfant et les écrans',
  author: 'Habib Tahrat',
  price: shop.price ?? '14,90 €',

  /**
   * Lien du bouton d'achat. Sur Shopify : lien panier direct vers le produit (/cart/<variante>:1).
   * En local, valeur de repli.
   */
  buyUrl: shop.buyUrl ?? 'https://hicgsr-19.myshopify.com/products/mon-enfant-et-les-ecrans',

  /** Menu principal : celui de Shopify, sinon ces liens par défaut. */
  menu:
    shop.menu && shop.menu.length > 0
      ? shop.menu
      : [
          { title: 'Accueil', url: '/' },
          { title: 'Le guide', url: shop.productUrl ?? '/products/mon-enfant-et-les-ecrans' },
          { title: 'Blog', url: '/blogs/conseils' },
          { title: 'Contact', url: '/pages/contact' },
        ],

  /** Liens légaux (CGV, remboursement…) fournis par Shopify. */
  links: shop.links ?? [],
}

/** Fichiers médias — voir README.md pour le format attendu de chacun. */
export const media = {
  /** Couverture à plat, utilisée comme texture du livre 3D. */
  coverFront: asset('product', 'cover-front.jpg'),
  /** Mockup détouré (PNG transparent) — affiché si la 3D n'est pas disponible. */
  mockup: asset('product', 'book-mockup.png'),
  /** Sommaire du guide : page visible quand le livre 3D s'ouvre. */
  sommaire: asset('pages', 'sommaire.jpg'),
  /**
   * Pages feuilletées quand le livre 3D s'ouvre, dans l'ordre : recto/verso de chaque feuille,
   * puis la dernière page (posée sur le bloc). Voir three/reading.ts.
   */
  reading: [
    asset('pages', 'sommaire.jpg'),
    asset('pages', 'page-03.jpg'),
    asset('pages', 'page-05.jpg'),
    asset('pages', 'page-09.jpg'),
    asset('pages', 'page-11.jpg'),
    asset('pages', 'page-13.jpg'),
    asset('pages', 'page-17.jpg'),
    asset('pages', 'page-22.jpg'),
    asset('bonus', 'affiche-defi-14-jours.jpg'),
    asset('bonus', 'cartes-idees.jpg'),
    asset('bonus', 'fiche-grands-parents.jpg'),
  ],
  sceneFamille: asset('scenes', 'scene-famille.jpg'),
  detailTablette: asset('scenes', 'detail-tablette.jpg'),
  bonus: {
    planFamilial: asset('bonus', 'affiche-plan-familial.jpg'),
    cinqTemps: asset('bonus', 'affiche-5-temps.jpg'),
    defi14: asset('bonus', 'affiche-defi-14-jours.jpg'),
    cartesModeEmploi: asset('bonus', 'cartes-mode-emploi.jpg'),
    cartes: asset('bonus', 'cartes-idees.jpg'),
    fiche: asset('bonus', 'fiche-grands-parents.jpg'),
  },
}
