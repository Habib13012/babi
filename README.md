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
| `public/images/scenes/scene-famille.jpg` | Photo intégrée à la couverture, 1400 × 1980 px | Piliers 1 et 2 |
| `public/images/scenes/detail-tablette.jpg` | Recadrage de la même photo | Fond de la phrase « On range la tablette » |
| `public/images/bonus/*.jpg` | Pages des 3 bonus | Pilier 3 et « Ce que vous recevez » |
| `public/images/product/book-mockup.png` | Mockup de la boutique (715 px) | Version 2D et section « Ce que vous recevez » |

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

## Déploiement

Site statique : le dossier `dist/` se déploie partout.

- **Vercel** : importer le dépôt. Framework « Vite », commande `npm run build`, dossier `dist`.
- **Netlify** : commande `npm run build`, dossier de publication `dist`.
- **Hébergement classique** : `npm run build`, puis envoyer le contenu de `dist/` à la racine du site.

Avant la mise en ligne, renseignez dans `src/config.ts` le lien exact de la fiche produit Shopify (`buyUrl`).
