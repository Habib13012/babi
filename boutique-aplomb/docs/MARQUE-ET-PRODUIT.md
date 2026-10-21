# Aplomb — marque, produit et cahier des charges de sourcing

## 1. Produit retenu : support d'ordinateur portable pliable en aluminium (« Socle 01 »)

**Pourquoi ce produit**

| Critère | Évaluation |
|---|---|
| Compréhension immédiate | Un objet, une fonction : surélever l'écran du portable. |
| Demande plausible | Télétravail et travail hybride durables ; usage quotidien, cadeau professionnel. Volume de recherche à mesurer (Google Trends / Keyword Planner) avant achat de stock. |
| Sourcing réel | Catégorie très répandue chez les fabricants (OEM/ODM) acceptant le marquage logo et de petites séries. |
| Livraison / retours | Objet rigide, plat une fois plié, non fragile, sans batterie : envoi en colis standard, retour simple. |
| Potentiel 3D | Mécanisme articulé (pliage/dépliage) idéal pour une démonstration animée. |
| Risque réglementaire | Faible : pas d'électronique, pas de contact alimentaire, pas d'allégation santé. Reste soumis au règlement général sur la sécurité des produits (RGSP, UE 2023/988) et à la REP emballages. |
| Caractéristiques mesurables | Dimensions, poids, hauteurs, charge, matériau : tout se vérifie sur échantillon. |
| Droits sur les visuels | Photos à produire soi-même (ou cédées par écrit par le fabricant) ; modèle 3D original. |

**À vérifier auprès du fournisseur avant toute mise en vente**

- Fiche technique signée : alliage, épaisseurs, dimensions plié/déplié, plage de hauteurs, poids, **charge maximale testée** (rapport d'essai), compatibilité (pouces).
- Contenu exact du colis (housse ? notice FR ?), emballage (matériaux, dimensions, poids colis).
- Identité complète du fabricant et, s'il est hors UE, **personne responsable dans l'UE** (importateur/mandataire) — obligation RGSP.
- Notice et avertissements de sécurité en français (pincement des articulations, charge maximale).
- Pays de fabrication, code douanier (SH), droits de douane et TVA import, incoterm.
- Prix unitaire, MOQ, délai de production, coût de marquage du logo, qualité de l'anodisation (échantillons des deux finitions).
- Fichier 3D (GLB/STEP) du produit si disponible, et autorisation écrite d'utiliser les photos éventuellement fournies.
- Taux de défaut et conditions de remplacement des pièces défectueuses.

> Les caractéristiques présentes dans `src/data/demo.ts` sont un **cahier des charges cible** (`verified: false`), pas des mesures.

## 2. Marque

- **Nom : Aplomb.** Expression française « d'aplomb » : à la verticale, bien posé, et au figuré, assuré. Court (6 lettres, 2 syllabes), prononçable en français et en anglais, directement lié à la fonction (redresser la posture de travail sans promesse médicale).
- **Disponibilité : NON vérifiée.** « Aplomb » est un mot du dictionnaire : il est probablement déjà utilisé par d'autres entreprises. Avant tout usage commercial :
  1. recherche d'antériorité INPI (data.inpi.fr), EUIPO (TMview) et WIPO (Global Brand Database), en classes 20 (mobilier, supports) et 35 (vente en ligne) — un mot courant peut être jugé peu distinctif pour un support de bureau ;
  2. recherche de noms de domaine et de comptes sociaux ;
  3. recherche Google / Amazon pour détecter un concurrent homonyme dans la même catégorie ;
  4. idéalement, avis d'un conseil en propriété industrielle. Alternatives si indisponible : « Aplomb Studio », « Maison Aplomb », ou un nouveau nom.
- **Domaines suggérés (non vérifiés)** : `aplomb-studio.fr`, `aplomb.store`, `maison-aplomb.fr`.

### Logo

- Symbole : un « A » dont la barre transversale est remplacée par un **fil à plomb** (ligne verticale + plomb cuivré). Lecture : la verticale retrouvée.
- Mot-symbole « aplomb » en bas de casse, vectorisé depuis Fraunces (licence SIL OFL, usage commercial autorisé).
- Fichiers : `public/brand/logo.svg` (encre), `logo-white.svg` (fond sombre), `logo-mono.svg` (noir 100 %), `mark.svg` (symbole), `src/app/icon.svg` (favicon), composant React `src/components/brand/Logo.tsx`.

### Système de design

| Jeton | Valeur | Usage |
|---|---|---|
| ink | `#15171A` | Texte, boutons principaux |
| graphite | `#2B2E33` | Texte secondaire |
| steel | `#5B6068` | Légendes (contraste AA sur papier) |
| alu | `#C7CAD0` | Rappel aluminium |
| mist | `#E6E3DD` | Fonds d'encarts |
| paper | `#F5F2EC` | Fond principal (papier chaud) |
| chalk | `#FBFAF7` | Cartes |
| copper | `#A44A23` | Accent, liens (contraste ≥ 4,5:1 sur papier) |

Typographies auto-hébergées (aucun appel à Google Fonts, favorable au RGPD) : **Fraunces** (titres, optique variable) et **Manrope** (texte). Rayons généreux, beaucoup d'espace, une seule couleur d'accent.

### Ton éditorial

Phrases courtes, concrètes, au présent. On décrit ce que fait l'objet, jamais ce qu'il « guérit ». Pas de superlatifs non prouvés, pas d'urgence, pas de prix barré.
