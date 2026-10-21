export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const productPath = (slug: string) => `/produit/${slug}`;

/** Pages publiques indexables (hors panier, paiement, confirmation). */
export const publicPages = [
  { path: "/", priority: 1 },
  { path: "/produit/socle-01", priority: 0.9 },
  { path: "/a-propos", priority: 0.5 },
  { path: "/faq", priority: 0.5 },
  { path: "/contact", priority: 0.4 },
  { path: "/livraison", priority: 0.4 },
  { path: "/retours", priority: 0.4 },
  { path: "/retractation", priority: 0.3 },
  { path: "/cgv", priority: 0.3 },
  { path: "/mentions-legales", priority: 0.3 },
  { path: "/confidentialite", priority: 0.3 },
  { path: "/cookies", priority: 0.2 },
] as const;
