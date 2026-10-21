# Checklist Google Merchant Center — Aplomb / Socle 01

> Aucune acceptation par Google ne peut être garantie. Cette checklist vise une boutique **réellement** conforme, pas le contournement des contrôles. Google n'a rien validé à ce jour.
>
> Audit réalisé le 21/10/2026 sur la version de démonstration (`STORE_DATA_MODE=demo`).

**Statuts** — VALIDÉ : vérifié concrètement (test exécuté) · À CONFIGURER : dépend d'une information ou d'un service externe · BLOQUANT : ne pas publier avant résolution · NON TESTÉ : aucune vérification effective.

Le code existant n'est jamais compté comme une validation : « VALIDÉ » ne porte que sur ce qui a été exécuté et observé.

## Verdict

**Publication impossible en l'état** : 33 bloquants en mode production (`STORE_DATA_MODE=production npm run check:launch`). Le build de production est refusé automatiquement tant qu'ils subsistent.

## Contrôles

| # | Contrôle | Statut | Détail |
|---|---|---|---|
| 1 | Identité juridique réelle et vérifiable | **BLOQUANT** | Dénomination, forme, SIREN, immatriculation, régime TVA absents (`seller.*` = `null`). Affichés « [À compléter] ». |
| 2 | Coordonnées fonctionnelles | **BLOQUANT** | E-mail, téléphone et adresse absents. Formulaire de contact opérationnel côté code mais sans boîte de réception (`SELLER_NOTIFICATION_EMAIL`). |
| 3 | Produit réellement disponible à la vente | **BLOQUANT** | Aucun fournisseur choisi, aucun stock. Variantes `available: false` en production. |
| 4 | Fournisseur et capacité d'expédition vérifiés | **BLOQUANT** | Voir cahier des charges `docs/MARQUE-ET-PRODUIT.md`. |
| 5 | Prix cohérent sur toutes les étapes | VALIDÉ (démo) / **BLOQUANT** (prod) | Testé : 69,00 € identique page produit, panier (143,90 € pour 2 + 5,90 €), JSON-LD (`69.00`), flux (`69.00 EUR`), montant envoyé à Stripe (test unitaire). Prix réel non fixé. |
| 6 | Stock réel | **BLOQUANT** | Mécanisme testé (décrément unique au paiement, rupture → `OutOfStock`/`out_of_stock`). Stock réel inconnu. |
| 7 | Frais de livraison visibles et exacts | **BLOQUANT** | Affichés avant paiement (testé) mais tarif de démonstration (5,90 €, transporteur non choisi). |
| 8 | Délais de livraison réalistes | **BLOQUANT** | Délais de démonstration (1–2 j + 2–3 j). Lieu d'expédition inconnu. |
| 9 | Politique de retour et de remboursement publiée | À CONFIGURER | Page `/retours` + fonction de rétractation en ligne (testée e2e). Adresse de retour et prise en charge des frais à décider. |
| 10 | Mentions légales et CGV adaptées | **BLOQUANT** | Modèles rédigés (droit français/UE), non relus par un professionnel, champs vendeur vides. Médiateur de la consommation absent. |
| 11 | Page produit accessible publiquement | VALIDÉ | `/produit/socle-01` répond 200 sans connexion, desktop et mobile (e2e). |
| 12 | Aucune fausse certification, garantie ou affiliation | VALIDÉ | Revue manuelle du code et des textes : aucun label, badge, partenariat ni garantie commerciale. Seules les garanties légales sont citées. |
| 13 | Aucun avis client fictif | VALIDÉ | Aucun avis sur le site ; test automatisé : pas de `Review`/`AggregateRating` dans le JSON-LD. |
| 14 | Images autorisées et représentatives | **BLOQUANT** | Aucune photo réelle. Seuls un prototype 3D et une illustration, tous deux étiquetés « rendu indicatif ». Merchant Center exige une vraie photo (`image_link`). |
| 15 | Données structurées cohérentes | VALIDÉ (démo) | Tests : prix, devise, disponibilité par variante, livraison, retours payants, absence d'offre sans prix. À valider avec l'outil « Résultats enrichis » de Google sur l'URL publique : NON TESTÉ. |
| 16 | Flux produit cohérent avec la page | VALIDÉ (démo) | `/merchant/google.xml` généré depuis les mêmes données (tests unitaires + e2e). Signale « ne pas soumettre » en démo. Pas encore importé dans Merchant Center : NON TESTÉ. |
| 17 | Devise et pays cible | À CONFIGURER | EUR / FR codés partout (Stripe limité à FR). Pays et langue à déclarer dans Merchant Center. |
| 18 | Paiement réel testé | **BLOQUANT** | Aucun compte Stripe. Seuls les tests unitaires (Stripe simulé, signature webhook réelle) ont tourné. Parcours Stripe test de bout en bout : NON TESTÉ. |
| 19 | HTTPS et domaine | **BLOQUANT** | Aucun domaine. En-têtes HSTS/CSP en place (code). |
| 20 | Sitemap et robots.txt | À CONFIGURER | Testé en démo : `robots.txt` bloque tout et le sitemap est vide (voulu). En production : pages publiques autorisées, `/api`, `/panier`, `/paiement`, `/commande` exclues — NON TESTÉ sur le domaine réel. |
| 21 | Version mobile testée | VALIDÉ (émulation) | Playwright Pixel 7 : 14 pages sans débordement horizontal ni erreur JS ; captures inspectées. Test sur vrais appareils : NON TESTÉ. |
| 22 | Aucun lien cassé | VALIDÉ | Liens internes de l'accueil, de la page produit et des CGV vérifiés (200). Liens externes : NON TESTÉ. |
| 23 | Aucune page juridique avec informations fictives | VALIDÉ | Aucune valeur inventée : les champs inconnus sont affichés « [À compléter : …] » et bloquent le build de production. |
| 24 | Aucun placeholder visible sur le site public | **BLOQUANT** | Les marqueurs « À compléter », « démo », « à confirmer » sont visibles tant que les données ne sont pas complètes — le build de production refuse de se lancer dans cet état (testé). |
| 25 | Conformité RGSP (fabricant, personne responsable UE, avertissements) | **BLOQUANT** | Section « Sécurité et traçabilité » prête, données absentes. |
| 26 | REP emballages (IDU) | **BLOQUANT** | Obligation à vérifier ; IDU à afficher. |
| 27 | Consentement cookies | VALIDÉ (démo) | Aucun traceur par défaut, donc aucun bandeau. Si `NEXT_PUBLIC_GA_MEASUREMENT_ID` est défini : bandeau Accepter/Refuser, chargement après consentement uniquement — NON TESTÉ avec un vrai identifiant. |
| 28 | Fonction de rétractation en ligne (directive UE 2023/2673) | VALIDÉ (démo) | Formulaire + accusé horodaté, testé e2e. Envoi réel de l'e-mail : NON TESTÉ (pas de clé Resend). Modalités de la transposition française à vérifier par un juriste. |

## Bloquants avant mise en production

| Information | Où la saisir | Comment l'obtenir |
|---|---|---|
| Identité du vendeur (nom/dénomination, forme, capital, SIREN, RCS/RNE) | `src/data/production.ts` → `seller` | Créer l'entreprise sur formalites.entreprises.gouv.fr ; reprendre l'avis INSEE / Kbis. |
| Régime et numéro de TVA | `seller.vatRegime`, `seller.vatNumber` | Expert-comptable ; espace professionnel impots.gouv.fr. |
| Adresse, e-mail, téléphone, directeur de publication | `seller.*` | Coordonnées réelles et joignables. |
| Hébergeur (nom, adresse, téléphone) | `seller.host` | Contrat de l'hébergeur choisi. |
| Médiateur de la consommation | `seller.mediator` | Adhésion à un médiateur référencé (economie.gouv.fr/mediation-conso). |
| IDU REP emballages | `seller.packagingUniqueId` | Adhésion à un éco-organisme emballages. |
| Relecture juridique | `legalTextsReviewed: true` | Avocat / juriste e-commerce. |
| Fournisseur, fiche technique, échantillon | `product.specs`, `boxContents`, `copyVerified` | Commander un échantillon ; mesurer ; corriger les textes. |
| Fabricant / personne responsable UE / consignes / pays d'origine | `product.manufacturer`, `euResponsiblePerson`, `safetyInformation`, `countryOfOrigin` | Documents du fabricant ou de l'importateur. |
| GTIN ou MPN | `product.gtin` / `product.mpn` | MPN interne ; GTIN via GS1 France si souhaité. |
| Photos réelles | `public/images/*` + `product.images` (`kind: "photo"`) | Photos du produit réel, fond neutre, sans texte ; cession de droits si non réalisées soi-même. |
| Prix TTC confirmé | `product.price` (`status: "confirmed"`) | Coût de revient complet + marge. |
| Stock et variantes | `variants[].available`, `initialStock` | Stock physiquement reçu. |
| Lieu d'expédition, transporteur, tarif, délais | `shipping.*` (`status: "confirmed"`) | Contrat/grille du transporteur, capacité de préparation réelle. |
| Frais et adresse de retour | `returns.*` | Décision commerciale + adresse réelle. |
| Domaine HTTPS | `NEXT_PUBLIC_SITE_URL` | Achat du domaine (après vérification de la marque). |
| Stripe (compte vérifié, clés, webhook) | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com. |
| E-mails transactionnels | `RESEND_API_KEY`, `EMAIL_FROM`, `SELLER_NOTIFICATION_EMAIL` | Compte Resend, domaine vérifié (SPF/DKIM). |
| Marque « Aplomb » | — | Recherche d'antériorité INPI/EUIPO/WIPO (voir `docs/MARQUE-ET-PRODUIT.md`). |

## Tests effectués

**Exécutés (21/10/2026, environnement de démonstration)**

| Test | Résultat |
|---|---|
| `npm run lint` (ESLint, règles Next/React) | OK, 0 erreur |
| `npm run typecheck` (TypeScript strict) | OK |
| `npm test` — 31 tests unitaires : prix, plafond de quantité, TVA, refus sans prix, bloquants, absence d'identité inventée, JSON-LD, flux XML (cohérence, échappement), création de session Stripe (montants serveur), idempotence webhook (même événement, même session), paiement différé, montant incohérent, expiration, échec d'e-mail, signature webhook réelle (SDK Stripe), garde-fous clés live/test, validation des formulaires, limiteur de débit | 31/31 OK |
| `npm run build` (mode démo) | OK |
| `STORE_DATA_MODE=production npm run build` | Refusé comme prévu (bloquants listés) |
| `npm run test:e2e` — Playwright Chromium desktop + Pixel 7 : 14 pages 200, 404, liens internes, panier/quantité/total, paiement indisponible sans Stripe, API checkout 503, webhook sans signature refusé, JSON-LD/canonical/noindex/robots/flux, rétractation (erreurs + succès), menu mobile clavier, mouvement réduit | 19 réussis, 1 ignoré (menu mobile sur desktop) |
| Captures d'écran desktop/mobile avec rendu WebGL (logiciel) inspectées | Héro 3D, récit au défilement, offre, page produit OK |

**Restant à effectuer**

- Parcours Stripe complet en mode test (paiement accepté, refusé, 3-D Secure, abandon, expiration, webhook rejoué) puis une vraie transaction live remboursée.
- Réception effective des e-mails (client et vendeur), délivrabilité.
- Lighthouse / Core Web Vitals sur le domaine réel ; test du rendu 3D sur vrais mobiles (iOS Safari, Android Chrome) et machines modestes.
- Audit d'accessibilité complet (lecteur d'écran NVDA/VoiceOver, axe).
- Test des résultats enrichis Google et de l'inspection d'URL Search Console.
- Import du flux dans Merchant Center et lecture du diagnostic.

## Étapes manuelles dans Google Merchant Center (après levée des bloquants)

1. Créer le compte Merchant Center avec l'identité réelle de l'entreprise ; renseigner **les informations sur l'entreprise** (nom, adresse, téléphone, service client) identiques au site.
2. **Valider et revendiquer le domaine** (balise HTML, Search Console ou fichier).
3. Configurer **la livraison** (France, tarif et délais identiques au site) et **la politique de retour** (14 jours, frais de retour conformes à `/retours`, URL de la politique).
4. Ajouter la source de données : fichier planifié `https://votre-domaine/merchant/google.xml` (pays : France, langue : français, devise : EUR), ou laisser Google lire les données structurées.
5. Vérifier le diagnostic produit (images, identifiants, prix, disponibilité) et corriger toute divergence à la source (`src/data/production.ts`), jamais dans le seul flux.
6. Activer les fiches gratuites, puis éventuellement Google Ads.
7. En cas de refus pour « déclaration trompeuse » : relire cette checklist, compléter ce qui manque, puis demander un réexamen — sans créer de nouveau compte pour contourner la décision.
