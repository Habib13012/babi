# Aplomb — installation du thème Shopify

Le fichier `aplomb-theme-shopify.zip` est un **thème Shopify Online Store 2.0** (Liquid). Il reprend le design, le logo et la 3D de la boutique Aplomb. Le paiement, les stocks, les taxes, la livraison, les e-mails de commande et le flux Google sont gérés **par Shopify**.

> Validé avec l'outil officiel `shopify theme check` : 51 fichiers, 0 erreur, 0 avertissement.
> **Pas encore testé dans une vraie boutique Shopify** : faites l'aperçu avant de publier.

---

## 1. Importer le thème

1. Admin Shopify › **Boutique en ligne › Thèmes**.
2. **Ajouter un thème › Importer un fichier zip** › choisir `aplomb-theme-shopify.zip`.
3. Une fois importé : **Personnaliser** (sans publier tout de suite).

## 2. Créer le produit

**Produits › Ajouter un produit** :

| Champ | Valeur |
|---|---|
| Titre | `Aplomb Socle 01` (ou `Socle 01`) |
| Description | Texte ci-dessous (à corriger face au produit réel) |
| Médias | **Photos réelles** du produit (fond neutre, sans texte ni filigrane) — obligatoires pour Google |
| Prix | Votre prix réel TTC — **pas de « prix avant réduction »** sauf réduction réelle et justifiable |
| Stock | Suivre la quantité, stock réellement reçu, **ne pas** vendre en rupture |
| SKU | `APL-S01-AR` / `APL-S01-GR` |
| Code-barres | GTIN si vous en avez (GS1) ; sinon laisser vide |
| Expédition | Produit physique, poids réel du colis |
| Variantes | Option « Couleur » : `Argent`, `Graphite` (uniquement celles réellement en stock) |
| Fournisseur | `Aplomb` (c'est la marque envoyée à Google) |
| Catégorie de produit | Électronique › Accessoires électroniques › Accessoires d'ordinateur › Supports et rehausseurs (à vérifier dans la liste Shopify) |

Description proposée :

> Socle 01 surélève votre ordinateur portable et incline le clavier. L'écran remonte vers la hauteur du regard, ce qui permet de travailler la tête plus droite qu'avec un portable posé à plat sur le bureau.
>
> Il se règle à plusieurs hauteurs grâce à deux articulations, puis se replie à plat pour être rangé ou glissé dans un sac. Des patins antidérapants protègent le bureau et maintiennent l'ordinateur en place.
>
> Pour une utilisation prolongée en position surélevée, un clavier et une souris séparés sont recommandés (non inclus).

⚠️ Chaque phrase doit être vraie pour le produit que vous recevez : supprimez ce qui ne correspond pas.

## 3. Régler le thème (Personnaliser › Paramètres du thème)

| Groupe | Réglage | À saisir |
|---|---|---|
| Mise en ligne | Boutique en préparation | **Laisser coché** jusqu'à la fin de la checklist (bandeau + `noindex`) |
| Identité du vendeur | Dénomination, adresse, e-mail, téléphone | Informations **réelles** (sinon « [À compléter] » s'affiche) |
| Informations commerciales | Mention de prix | Micro-entreprise en franchise de TVA : `Prix final — TVA non applicable, art. 293 B du CGI. Livraison en sus.` |
| | Tarif et délai de livraison | **Identique** à Paramètres › Expédition et livraison |
| | Lieu d'expédition | Ville et pays réels de départ des colis |
| | Frais de retour | Client ou boutique |
| | Moyens de paiement | Ceux réellement activés dans Paramètres › Paiements |

Puis, dans les sections :

- **Héro 3D**, **Offre** : sélectionner le produit Socle 01.
- **Fiche produit** (modèle Produit) : vérifier chaque caractéristique. Ne cocher « Vérifiée » qu'après mesure ou fiche technique (sinon le badge « à confirmer » reste visible). Renseigner Fabricant, Personne responsable UE, Pays de fabrication et Consignes de sécurité (obligations RGSP).
- **3D** : le prototype est affiché avec la mention « rendu indicatif ». Pour le vrai modèle : téléverser le fichier `.glb` du fabricant dans **Contenu › Fichiers**, coller son URL dans « URL d'un modèle GLB réel », et ne décocher la mention qu'après vérification face au produit.

## 4. Pages et menus

**Boutique en ligne › Pages › Ajouter une page** :

| Page | Modèle de thème | Contenu |
|---|---|---|
| À propos | `page` | Texte de la section 6 |
| Contact | `page.contact` | Une phrase d'introduction |
| Se rétracter du contrat | `page.retractation` | « Vous disposez de 14 jours après réception pour vous rétracter, sans justification. Remplissez ce formulaire puis confirmez. » |
| Questions fréquentes | `page.faq` | Vide (les questions sont dans la section) |

**Navigation** :
- `main-menu` : Socle 01 (produit) · Livraison (politique d'expédition) · À propos · FAQ.
- `footer` : Contact · Se rétracter du contrat · FAQ. Les politiques Shopify s'ajoutent automatiquement dans « Informations légales ».

⚠️ Le formulaire de rétractation utilise le formulaire de contact Shopify : la demande arrive dans votre boîte e-mail, mais **Shopify n'envoie pas d'accusé de réception automatique au client**. Répondez manuellement sans délai, ou ajoutez une application de « contact form » qui envoie un accusé, afin de respecter l'obligation d'accusé de réception sur support durable.

## 5. Politiques (Paramètres › Politiques)

Remplacez les modèles Shopify par les textes ci-dessous, en complétant **tous** les `[À COMPLÉTER]`. Faites-les relire par un professionnel du droit : ce sont des modèles, pas un conseil juridique.

### Coordonnées / Mentions légales

```
Éditeur du site et vendeur
Nom commercial : Aplomb
Dénomination / nom : [À COMPLÉTER]
Forme juridique : [À COMPLÉTER] (capital social : [À COMPLÉTER si société])
Adresse : [À COMPLÉTER]
SIREN : [À COMPLÉTER] — Immatriculation : [À COMPLÉTER : RCS Ville ou RNE]
TVA : [À COMPLÉTER : n° de TVA intracommunautaire, ou « TVA non applicable, art. 293 B du CGI »]
E-mail : [À COMPLÉTER] — Téléphone : [À COMPLÉTER]
Directeur de la publication : [À COMPLÉTER]

Hébergeur : Shopify International Limited, Victoria Buildings, 2e étage, 1-2 Haddington Road, Dublin 4, D04 XN32, Irlande. [À VÉRIFIER dans vos conditions Shopify]

Identifiant unique REP emballages : [À COMPLÉTER : IDU délivré par l'ADEME]

Propriété intellectuelle : le nom « Aplomb », le logo, les textes et le modèle 3D sont protégés. Les polices Fraunces et Manrope sont utilisées sous licence SIL Open Font License.
```

### Politique d'expédition

```
Zone desservie : France métropolitaine uniquement.
Lieu d'expédition : les colis partent de [À COMPLÉTER : ville, pays].
Transporteur et tarif : [À COMPLÉTER : ex. Colissimo suivi — X,XX € TTC par commande].
Délais : préparation sous [À COMPLÉTER] jours ouvrés après confirmation du paiement, puis [À COMPLÉTER] jours ouvrés de transport. Un numéro de suivi est envoyé par e-mail.
Le tarif est affiché avant le paiement. À défaut d'indication contraire, la livraison intervient au plus tard 30 jours après la commande (art. L216-1 du code de la consommation).
À la réception : en cas de colis endommagé ou incomplet, émettez des réserves auprès du transporteur et contactez-nous ; vos garanties légales s'appliquent dans tous les cas.
```

### Politique de remboursement (retours)

```
Droit de rétractation : vous disposez de 14 jours à compter de la réception du produit pour vous rétracter, sans avoir à vous justifier.
Comment faire : utilisez la page « Se rétracter du contrat », écrivez-nous à [À COMPLÉTER : e-mail], ou envoyez le formulaire type ci-dessous.
Renvoi : renvoyez le produit au plus tard 14 jours après votre déclaration, complet, à : [À COMPLÉTER : adresse de retour].
Frais de retour : [À COMPLÉTER : « à votre charge (environ X € en envoi suivi) » OU « à notre charge, étiquette fournie »].
Remboursement : toutes les sommes versées, frais de livraison initiaux inclus (tarif standard), au plus tard 14 jours après réception de votre rétractation, par le même moyen de paiement. Nous pouvons différer le remboursement jusqu'à réception du produit ou preuve de son expédition.
Produit défectueux ou non conforme : garantie légale de conformité (2 ans) et garantie des vices cachés ; dans ce cas, les frais de retour sont à notre charge.

Formulaire type de rétractation
À l'attention de [À COMPLÉTER : nom, adresse, e-mail] :
Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*) ci-dessous :
Commandé le (*)/reçu le (*) :
Nom du (des) consommateur(s) :
Adresse du (des) consommateur(s) :
Signature du (des) consommateur(s) (uniquement en cas de notification sur papier) :
Date :
(*) Rayez la mention inutile.
```

### Conditions générales de vente

Reprendre le texte complet de la page CGV du projet (`src/app/cgv/page.tsx`) en adaptant l'article « Paiement » :

```
Paiement : le paiement s'effectue au moment de la commande via la solution de paiement de Shopify ([À COMPLÉTER : moyens réellement activés]). Les données de carte sont traitées par Shopify et ses partenaires de paiement certifiés PCI-DSS ; nous n'y avons pas accès.
Commande : le contrat est conclu lorsque vous cliquez sur « Payer maintenant » sur la page de paiement, après avoir vérifié le récapitulatif ; un e-mail de confirmation vous est envoyé.
Médiation : en cas de litige non résolu, vous pouvez recourir gratuitement au médiateur de la consommation : [À COMPLÉTER : nom, adresse, site du médiateur].
```

Le bloc « Garanties légales » (texte de l'article L217 et vices cachés) doit être repris tel quel depuis la page CGV.

### Politique de confidentialité

Partir du modèle Shopify, puis vérifier : responsable du traitement ([À COMPLÉTER]), sous-traitants (Shopify, transporteur, outil e-mail), durées de conservation, droits RGPD, réclamation auprès de la CNIL.

## 6. Texte « À propos »

> Aplomb est une marque indépendante qui ne vend qu'un produit : Socle 01, un support d'ordinateur portable. Le nom vient de l'expression « d'aplomb » : à la verticale, bien posé.
>
> Nous ne fabriquons pas nous-mêmes : Socle 01 est produit par un fabricant tiers, sélectionné sur échantillon ; son identité est indiquée sur la page produit. Nous assurons la sélection, le contrôle, la vente, l'expédition et le service après-vente.
>
> Notre engagement : tout ce qui est écrit sur ce site doit être vérifiable. Pas de faux avis, pas de prix barré, pas de compte à rebours, et des frais affichés avant le paiement.

## 7. Paramètres Shopify à vérifier

- **Paramètres › Expédition et livraison** : zone France, tarif et délais **identiques** au réglage du thème.
- **Paramètres › Taxes et droits** : selon votre régime de TVA (avec un expert-comptable).
- **Paramètres › Paiements** : activer Shopify Payments (ou autre), faire une **commande test** (mode test), puis une vraie commande remboursée.
- **Paramètres › Paiement (checkout)** : activer « Exiger l'acceptation des conditions » si disponible, langue française.
- **Paramètres › Notifications** : vérifier l'e-mail de confirmation de commande (français, coordonnées).
- **Préférences** : titre et méta-description de la page d'accueil ; mot de passe de boutique tant que rien n'est prêt.
- **Domaine** : connecter votre domaine (HTTPS automatique).
- **Cookies** : Shopify affiche sa propre bannière de consentement (Paramètres › Confidentialité des clients) : à activer pour l'UE.

## 8. Google Merchant Center via Shopify

1. Installer l'application **Google & YouTube** (gratuite, éditée par Google).
2. Connecter le compte Google, créer ou lier Merchant Center, choisir **France / français / EUR**.
3. L'application synchronise le produit (titre, prix, stock, images, variantes) : aucune saisie de flux manuelle, et les mêmes données que la page.
4. Dans Merchant Center : renseigner les informations sur l'entreprise, valider le domaine, configurer livraison et retours **identiques** au site.
5. Le thème publie les données structurées Product/Offer générées par Shopify (`structured_data`), **sans avis ni note fictifs**.
6. Avant de soumettre : décocher « Boutique en préparation », retirer le mot de passe, et vérifier qu'aucun « [À compléter] » ou « à confirmer » ne reste visible.

Aucune acceptation par Google n'est garantie. La checklist complète se trouve dans `docs/GOOGLE-MERCHANT-CHECKLIST.md`. Avec Shopify, les lignes « Paiement », « Flux » et « HTTPS » sont prises en charge par la plateforme, mais doivent tout de même être testées.

## 9. Différences avec la version Next.js

| Fonction | Version Next.js | Thème Shopify |
|---|---|---|
| Paiement | Stripe Checkout + webhook maison | Paiement Shopify natif |
| Stock, commandes, e-mails | Base SQLite + Resend | Shopify |
| Flux Merchant | `/merchant/google.xml` | Application Google & YouTube |
| Pages légales | Pages du site | Politiques Shopify (textes ci-dessus) |
| Rétractation | Formulaire + accusé automatique | Formulaire de contact (accusé à envoyer manuellement ou via une application) |
| Blocage tant qu'il manque des infos | Build refusé | Bandeau, `noindex` et marqueurs « [À compléter] » visibles : c'est à vous de ne pas publier trop tôt |
| Plafond de quantité | Contrôlé côté serveur | Limité dans l'interface seulement |

## 10. Modifier la 3D

Le code source est dans `shopify-src/aplomb-3d.js`. Après modification, recompilez-le puis réimportez le thème :

```bash
npm run shopify:build   # recompile assets/aplomb-3d.js et régénère le zip
```
