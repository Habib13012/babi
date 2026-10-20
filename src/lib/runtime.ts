/**
 * Données injectées par le thème Shopify (voir shopify/sections/immersive.liquid).
 * En local (npm run dev), ces variables n'existent pas et on retombe sur /public.
 */
type ShopLink = { title: string; url: string }
type ShopData = {
  /** nom de la marque (réglage du thème) */
  brand?: string
  /** menu principal Shopify (Navigation → Menu principal) */
  menu?: ShopLink[]
  /** URL de la fiche produit */
  productUrl?: string
  title?: string
  price?: string
  /** ancien prix (barré), vide s'il n'y a pas de réduction */
  comparePrice?: string
  /** réduction en %, arrondie */
  discount?: number
  buyUrl?: string
  available?: boolean
  /** nombre d'articles dans le panier */
  cartCount?: number
  links?: ShopLink[]
}

declare global {
  interface Window {
    /** nom de fichier → URL CDN Shopify (avec ?v= pour l'invalidation du cache) */
    __ASSETS__?: Record<string, string>
    __SHOP__?: ShopData
  }
}

const assets = typeof window !== 'undefined' ? window.__ASSETS__ : undefined

/** URL d'un fichier image : dossier assets du thème sur Shopify, /images/<dossier>/ en local. */
export const asset = (folder: string, file: string) => assets?.[file] ?? `/images/${folder}/${file}`

export const shop: ShopData = (typeof window !== 'undefined' && window.__SHOP__) || {}
