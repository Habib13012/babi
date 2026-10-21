# Aplomb — boutique mono-produit (Socle 01)

Boutique e-commerce d'un seul produit, avec présentation 3D interactive, paiement Stripe Checkout et structure préparée pour Google Merchant Center.

> **État : en préparation.** Le site tourne par défaut avec des **données de démonstration** (bandeau visible, `noindex`, paiement en mode test uniquement). Le build de production est **volontairement refusé** tant que les informations réelles manquent : voir `npm run check:launch` et [`docs/GOOGLE-MERCHANT-CHECKLIST.md`](docs/GOOGLE-MERCHANT-CHECKLIST.md).

- Marque, produit, logo, cahier des charges fournisseur : [`docs/MARQUE-ET-PRODUIT.md`](docs/MARQUE-ET-PRODUIT.md)
- Checklist Merchant Center et bloquants : [`docs/GOOGLE-MERCHANT-CHECKLIST.md`](docs/GOOGLE-MERCHANT-CHECKLIST.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · React Three Fiber / drei / three.js · Stripe Checkout · SQLite intégré à Node (`node:sqlite`) · Zod · Vitest · Playwright.

Prérequis : **Node.js ≥ 22.13** (pour `node:sqlite`).

## Démarrer

```bash
npm install
cp .env.example .env.local     # STORE_DATA_MODE=demo par défaut
npm run dev                    # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Tests unitaires (prix, flux, JSON-LD, webhook, validation) |
| `npm run build` | Build (refusé en mode production s'il reste des bloquants) |
| `npm run test:e2e` | Tests de bout en bout (après `npm run build` ; `PW_CHROMIUM_PATH` pour un Chromium déjà installé) |
| `npm run check:launch` | Liste des informations bloquantes avant publication |

## Architecture

```
src/
  data/            production.ts (seules données publiables, null = inconnu)
                   demo.ts (valeurs de démonstration, marquées status "demo")
                   index.ts (sélection via STORE_DATA_MODE)
  lib/             pricing.ts (calcul partagé client/serveur — le serveur fait foi)
                   readiness.ts (bloquants de mise en production)
                   structured-data.ts (JSON-LD Product/Offer, sans avis)
                   merchant-feed.ts (flux XML Merchant Center)
                   db.ts (commandes, stock, événements Stripe, rétractations)
                   payments/ (checkout Stripe, webhook idempotent, garde-fous live/test)
                   email.ts (Resend via HTTP ; journalisation en dev)
  components/three  modèle procédural (prototype), scène, chargeur différé, récit au défilement
  app/              pages, routes API, sitemap, robots, flux /merchant/google.xml
```

**Une seule source de vérité** : page produit, panier, paiement, JSON-LD et flux Merchant Center lisent les mêmes objets (`src/data/*`) et le même stock (base SQLite). Les montants envoyés à Stripe sont recalculés côté serveur.

### Parcours de commande

1. Le panier (stockage local) ne contient que `variante + quantité`.
2. `/paiement` : informations précontractuelles, case CGV obligatoire, bouton « Commander avec obligation de paiement ».
3. `POST /api/checkout` : validation Zod, recalcul du prix, contrôle du stock, création d'une commande `pending`, session Stripe Checkout (adresse limitée à la France, livraison au tarif configuré, carte uniquement, clé d'idempotence).
4. `POST /api/webhooks/stripe` : signature vérifiée, événement enregistré une seule fois, contrôle du montant payé, décrément du stock, statut `paid` (ou `needs_review` si montant/stock incohérents), e-mail de confirmation **uniquement après paiement confirmé** et une seule fois.
5. `/commande/confirmation` affiche l'état réel en base (jamais « succès » sur la seule base de la redirection).

Garde-fous : clé `sk_live_` refusée en mode démo ; clé live refusée s'il reste un bloquant ; sans clé, le paiement est affiché comme indisponible.

### 3D

- `StandModel.tsx` : **prototype procédural** (support pliable en Z), toujours accompagné de la mention « Prototype 3D — rendu indicatif, non contractuel ».
- Chargement différé (`next/dynamic`, à l'approche de l'écran), illustration SVG de remplacement, détection WebGL, `ErrorBoundary`, rendu suspendu hors écran, résolution réduite sur mobile / machines modestes, `prefers-reduced-motion` respecté (pas d'auto-rotation ni d'animation d'intro).
- **Remplacer par le modèle réel** : déposer `public/models/socle-01.glb` (compressé Draco/Meshopt, < 2 Mo idéalement) puis dans `src/data/production.ts` :
  ```ts
  model: { type: "gltf", url: "/models/socle-01.glb", verified: true },
  ```
  (`verified: true` uniquement après comparaison avec le produit réel ; la mention « rendu indicatif » disparaît alors.)

## Passer en production

1. Compléter **toutes** les valeurs `null` de `src/data/production.ts` avec des informations réelles (vendeur, produit, prix `status: "confirmed"`, stock, livraison, retours), ajouter les photos dans `public/images/` et les déclarer dans `product.images` (`kind: "photo"`).
2. Faire relire les textes juridiques (`src/app/cgv`, `mentions-legales`, `confidentialite`, `retours`, `retractation`) puis `legalTextsReviewed: true`.
3. Variables d'environnement (voir `.env.example`) : `STORE_DATA_MODE=production`, `NEXT_PUBLIC_SITE_URL=https://…`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `SELLER_NOTIFICATION_EMAIL`, `ORDERS_DB_PATH` (disque persistant).
4. `npm run check:launch` doit afficher « Aucun bloquant ».
5. Tester de bout en bout **en mode test Stripe** sur l'URL de préproduction (carte `4242 4242 4242 4242`, carte refusée `4000 0000 0000 0002`, abandon, expiration, renvoi d'un webhook depuis le tableau de bord) avant de passer aux clés live.

## Déploiement

Le stockage SQLite exige **un serveur Node avec disque persistant** (ex. VPS, Railway/Render/Fly.io avec volume, Scalingo, Clever Cloud) :

```bash
npm ci
STORE_DATA_MODE=production npm run build
ORDERS_DB_PATH=/data/orders.sqlite npm start   # derrière HTTPS (reverse proxy)
```

- Webhook Stripe : endpoint `https://votre-domaine/api/webhooks/stripe`, événements `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`.
- Sauvegarder régulièrement le fichier SQLite.
- Hébergement serverless (Vercel, Netlify) : remplacer `src/lib/db.ts` par une base gérée (Postgres) en conservant les mêmes fonctions, et le limiteur de débit en mémoire par un stockage partagé.

## Limites connues

- Limiteur de débit en mémoire (une instance).
- CSP avec `'unsafe-inline'` pour les scripts (hydratation Next.js sans nonce).
- `npm audit` signale 5 vulnérabilités « high » dans des dépendances **de développement** d'`eslint-config-next` (braces/micromatch), non embarquées dans le site.
- Gestion des commandes (expédition, remboursements) : à faire depuis le tableau de bord Stripe et la base ; pas d'interface d'administration.
