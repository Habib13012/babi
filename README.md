# Mon enfant et les écrans — site immersif

Landing page cinématique pour le guide de Habib Tahrat. Le livre est un **vrai objet 3D** (Three.js) habillé de la couverture ; il pivote, recule, s'ouvre et revient au fil du défilement.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4**
- **GSAP + ScrollTrigger + SplitText** : sections épinglées, animations liées au scroll, révélations par masque
- **React Three Fiber + drei** : livre 3D, éclairage par panneaux lumineux (aucun HDR à télécharger), ombre de contact
- **Lenis** : défilement fluide, désactivé si l'utilisateur limite les animations

## Lancer le projet

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production dans dist/
npm run preview   # sert le build localement
npm run lint
```

Node 20 ou plus récent.

## Où modifier quoi

| Fichier | Rôle |
|---|---|
| `src/config.ts` | **Lien d'achat**, prix, chemins des images |
| `src/content.ts` | Tous les textes du site |
| `src/three/choreography.ts` | Positions et rotations du livre 3D, section par section (ordinateur et mobile) |
| `src/three/Book.tsx` | Le livre 3D : dimensions, matériaux |
| `src/three/textures.ts` | Tranche et 4e de couverture, dessinées en code |
| `src/sections/*` | Les 8 scènes de la page |

## Structure de la page

1. **Ouverture** : titre animé lettre par lettre, livre 3D qui suit la souris et se fait pivoter au doigt
2. **Le moment** (section épinglée) : « Il est l'heure d'éteindre… Ça finit en cris », pendant que le livre recule dans l'ombre
3. **Découverte** (épinglée) : le livre fait un tour complet (face, dos, tranche), puis la couverture s'ouvre
4. **Les 3 piliers** : règles claires, phrases prêtes à dire, outils à imprimer, avec des images révélées par masque et de la parallaxe
5. **Les 14 jours** (défilement horizontal épinglé), avec les étapes de l'affiche « Mon défi de 14 jours »
6. **Feuilletez le guide** : galerie de pages intérieures en parallaxe
7. **Ce que vous recevez** : compteurs liés au scroll, liste des bonus avec aperçus
8. **Final** : le livre revient, appel à l'achat

## Fichiers médias

Tous les visuels proviennent des PDF du guide et des bonus. Les PDF eux-mêmes ne sont **pas** publiés : seuls des aperçus en JPG le sont.

| Fichier | Source | Utilité |
|---|---|---|
| `public/images/product/cover-front.jpg` | Page 1 du guide, 1800 × 2546 px | Texture de la couverture du livre 3D |
| `public/images/pages/sommaire.jpg` | Page 2 du guide | Page visible quand le livre 3D s'ouvre |
| `public/images/pages/page-03…22.jpg` | Pages 3, 5, 9, 13, 17, 22 | Galerie « Feuilletez le guide » |
| `public/images/scenes/pilier-regles.jpg` | Photo 4:5, 922 × 1152 px | Pilier 1 « Règles claires » |
| `public/images/scenes/pilier-phrases.jpg` | Photo 4:5, 922 × 1152 px | Pilier 2 « Phrases prêtes à dire » |
| `public/images/scenes/detail-tablette.jpg` | Recadrage de la même photo | Fond de la phrase « On range la tablette » |
| `public/images/bonus/*.jpg` | Pages des 3 bonus | Pilier 3 et « Ce que vous recevez » |
| `public/images/product/book-mockup.png` | Mockup de la boutique (715 px) | Image de partage (og:image) en développement |
| `public/images/product/book-mockup.webp` | Même mockup en WebP (65 Ko) | Version 2D, section « Ce que vous recevez » |

Pour régénérer un aperçu après une mise à jour du PDF (poppler-utils) :

```bash
pdftoppm -f 1 -l 1 -scale-to-x 1800 -scale-to-y -1 -jpeg -jpegopt quality=86 -singlefile guide.pdf public/images/product/cover-front
```

Pour changer les pages montrées dans la galerie, modifiez `pagesPreview` dans `src/content.ts`.

## Accessibilité et robustesse

- `prefers-reduced-motion` : pas de défilement fluide, pas de flottement ni d'inclinaison du livre ; les animations deviennent de simples changements d'état
- Sans WebGL (ou si la scène plante, ou si le GPU perd le contexte) : bascule automatique sur le mockup 2D
- Livre 3D pilotable au clavier (Tab, puis flèches gauche et droite) ; lien d'évitement « Aller au contenu »
- La boucle de rendu 3D se met en pause quand le livre est hors champ
- Pas de défilement horizontal : `overflow-x: clip` sur le body
- La scène 3D est chargée dans un fichier séparé, après le premier affichage

## Thème Shopify

```bash
npm run build:shopify   # → dist-shopify/theme-mon-enfant-et-les-ecrans.zip
```

Le zip est un thème complet, prêt à importer :

1. Shopify Admin → **Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier zip**.
2. Choisir `theme-mon-enfant-et-les-ecrans.zip`.
3. **Aperçu** pour vérifier, puis **Publier**.

Fonctionnement :

- La **page d'accueil** et la **page produit** affichent l'expérience immersive. Le produit vendu sur l'accueil se choisit dans l'éditeur de thème (section « Expérience immersive » ; par défaut `mon-enfant-et-les-ecrans`).
- Le **prix** vient de Shopify, et le bouton d'achat est un lien panier direct (`/cart/<variante>:1`) qui mène au paiement.
- Les **liens légaux** (CGV, remboursement…) s'affichent automatiquement dans le pied de page s'ils sont remplis dans *Paramètres → Politiques*.
- Panier, collections, recherche, pages, blog, page mot de passe et carte cadeau ont des gabarits simples dans le même style (`shopify/`).
- Les polices sont hébergées dans le thème : aucune requête vers Google Fonts.

Sources du thème : `shopify/` (Liquid, CSS des pages classiques). Le script `scripts/build-shopify.mjs` y ajoute le bundle (`assets/immersive.js`, `immersive.css`, polices) et les images, à plat dans `assets/`. Validé avec Theme Check : aucune erreur, aucun avertissement.

## Déploiement hors Shopify

Site statique : le dossier `dist/` se déploie partout.

- **Vercel** : importer le dépôt. Framework « Vite », commande `npm run build`, dossier `dist`.
- **Netlify** : commande `npm run build`, dossier de publication `dist`.
- **Hébergement classique** : `npm run build`, puis envoyer le contenu de `dist/` à la racine du site.

Avant la mise en ligne, renseignez dans `src/config.ts` le lien exact de la fiche produit Shopify (`buyUrl`).
