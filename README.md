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
| `src/three/textures.ts` | Tranche, 4e de couverture et page de titre, dessinées en code |
| `src/sections/*` | Les 7 scènes de la page |

## Structure de la page

1. **Ouverture** : titre animé lettre par lettre, livre 3D qui suit la souris et se fait pivoter au doigt
2. **Le moment** (section épinglée) : « Il est l'heure d'éteindre… Ça finit en cris », pendant que le livre recule dans l'ombre
3. **Découverte** (épinglée) : le livre fait un tour complet (face, dos, tranche), puis la couverture s'ouvre
4. **Les 3 piliers** : règles claires, phrases prêtes à dire, outils à imprimer, avec des images révélées par masque et de la parallaxe
5. **Les 14 jours** (défilement horizontal épinglé)
6. **Ce que vous recevez** : compteurs liés au scroll et liste des bonus
7. **Final** : le livre revient, appel à l'achat

## Fichiers médias

| Fichier | Emplacement | Utilité | Format idéal |
|---|---|---|---|
| `cover-front.jpg` | `public/images/product/` | Texture de la couverture du livre 3D | Couverture **à plat**, sans perspective, JPG, 1800 × 2546 px (ratio A4) |
| `book-mockup.png` | `public/images/product/` | Version 2D (si la 3D est indisponible) et section « Ce que vous recevez » | PNG détouré, fond transparent, ≥ 1500 px de haut |
| `scene-famille.jpg` | `public/images/scenes/` | Piliers 1 et 2 | Photo originale de la couverture, JPG, ≥ 2400 px de large |
| `detail-tablette.jpg` | `public/images/scenes/` | Arrière-plan de la phrase « On range la tablette » | JPG, ≥ 1200 px de large |

> **Visuels temporaires** : la version actuelle utilise des images **extraites des captures d'écran de la boutique** (couverture redressée depuis le mockup, photo recadrée). Ce sont bien les vrais visuels du guide, mais en basse définition. Remplacez-les par les fichiers originaux sous **le même nom** : aucun code à modifier.

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
