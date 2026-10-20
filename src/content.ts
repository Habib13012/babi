import { asset } from './lib/runtime'

/**
 * Textes du site. Tout est rassemblé ici pour être modifié sans toucher aux composants.
 * Les faits (pages, jours, bonus, âges, prix) reprennent ceux de la fiche produit actuelle.
 */

export const hero = {
  eyebrow: 'Guide pratique pour les parents',
  titleTop: 'Mon enfant',
  titleBottom: 'et les écrans',
  lead: "Le plan en 14 jours pour reprendre la main quand éteindre l'écran finit en cris. Des règles claires et des mots simples, pour toute la famille.",
}

export const moment = [
  { kicker: 'Vous connaissez ce moment.', text: "Il est l'heure d'éteindre." },
  { kicker: 'Vous le dites calmement.', text: '« On range la tablette. »' },
  { kicker: 'Et pourtant…', text: 'Ça finit en cris.' },
  { kicker: 'Ce guide est né pour ce moment-là.', text: 'Sans cris ni guerre.' },
]

export const discover = {
  eyebrow: 'Le guide',
  title: 'Un plan simple, à lire en une soirée.',
  notes: [
    { value: '25', label: 'pages, à lire en une soirée' },
    { value: 'PDF', label: 'à lire sur écran ou à imprimer' },
    { value: '2–14', label: 'ans : des repères adaptés à chaque âge' },
  ],
  /** Une légende par double page feuilletée (voir config.media.reading pour les pages). */
  spreads: [
    {
      eyebrow: 'Le sommaire',
      title: '8 chapitres courts, 1 plan, 3 outils.',
      text: 'Pensé pour être lu en une soirée et appliqué dès le lendemain.',
    },
    {
      eyebrow: 'Avant de commencer · Chapitre 1',
      title: 'Comprendre pourquoi ils décrochent si mal.',
      text: "Ce qui se joue chez votre enfant au moment où vous éteignez l'écran.",
    },
    {
      eyebrow: 'Chapitres 3 et 4',
      title: 'Des repères par âge, un plan familial.',
      text: "Ce qui est raisonnable de 2 à 14 ans, et des règles valables pour tous, adultes compris.",
    },
    {
      eyebrow: 'Chapitres 5 et 7',
      title: "Gérer la crise, remplacer l'écran.",
      text: "La méthode en 5 temps quand on coupe, et des alternatives concrètes selon l'âge.",
    },
    {
      eyebrow: 'Outil 1 · Bonus 1',
      title: 'Le plan familial et le défi de 14 jours.',
      text: 'Des fiches à remplir et des affiches à accrocher, pour que le plan vive au quotidien.',
    },
    {
      eyebrow: 'Bonus 2 · Bonus 3',
      title: '30 idées sans écran, et la fiche pour la nounou.',
      text: "Pour que tout le monde applique les mêmes règles, même quand vous n'êtes pas là.",
    },
  ],
  final: {
    eyebrow: 'Le guide complet',
    title: 'Le guide + 3 bonus.',
    text: "25 pages, le plan en 14 jours, 3 affiches, 30 cartes d'idées et la fiche grands-parents.",
    cta: 'Obtenir le guide',
  },
}

export const pillars = [
  {
    index: '01',
    title: 'Règles claires',
    text: "Des repères simples, adaptés à l'âge de votre enfant, de 2 à 14 ans, que toute la famille comprend et peut tenir dans la durée.",
    visual: { kind: 'photo', position: '45% 62%', zoom: 1 },
    alt: 'Une mère agenouillée face à son jeune fils, souriants, dans un salon baigné de lumière.',
  },
  {
    index: '02',
    title: 'Phrases prêtes à dire',
    text: "Les mots à dire pendant la crise, quand on n'a plus d'idées ni de patience.",
    visual: { kind: 'photo', position: '50% 52%', zoom: 1.9 },
    alt: 'Gros plan sur une mère et son fils qui se regardent en souriant.',
  },
  {
    index: '03',
    title: 'Outils à imprimer',
    text: "Des affiches à accrocher et des cartes d'idées pour remplacer l'écran, pour que le plan vive au quotidien.",
    visual: { kind: 'posters' },
    alt: 'Les trois affiches à imprimer : le plan familial, les 5 temps et le défi de 14 jours.',
  },
] as const

/** Les 14 jours, tels qu'ils figurent sur l'affiche « Mon défi de 14 jours ». */
export const days = [
  { phase: 'Observer', title: 'Lire les chapitres 1 à 3' },
  { phase: 'Observer', title: 'Repérer les déclencheurs de crise' },
  { phase: 'Observer', title: "Noter nos temps d'écran, adultes aussi" },
  { phase: 'Préparer', title: "Se mettre d'accord entre adultes" },
  { phase: 'Préparer', title: 'Écrire le plan familial' },
  { phase: 'Préparer', title: "Présenter le plan à l'enfant, au calme" },
  { phase: 'Préparer', title: 'Afficher le plan, choisir un minuteur' },
  { phase: 'Appliquer', title: 'Repas sans écran pour tous' },
  { phase: 'Appliquer', title: 'Écrans hors de la chambre le soir' },
  { phase: 'Appliquer', title: "Un matin sans écran avant l'école" },
  { phase: 'Appliquer', title: 'Réduire la durée, avec préavis de fin' },
  { phase: 'Appliquer', title: 'Faire le point en famille' },
  { phase: 'Appliquer', title: 'Un moment de qualité sans écran' },
  { phase: 'Appliquer', title: 'Bilan et ajustements' },
]

/** Pages montrées dans la galerie « Feuilletez le guide ». */
export const pagesPreview = [
  { src: asset('pages', 'page-03.jpg'), alt: 'Page « Avant de commencer »' },
  { src: asset('pages', 'page-05.jpg'), alt: 'Chapitre 1 : Pourquoi ils décrochent si mal' },
  { src: asset('pages', 'page-09.jpg'), alt: "Chapitre 3 : Les repères d'âge" },
  { src: asset('pages', 'page-13.jpg'), alt: 'Chapitre 5 : Gérer la crise quand on coupe' },
  { src: asset('pages', 'page-17.jpg'), alt: "Chapitre 7 : Remplacer l'écran" },
  { src: asset('pages', 'page-22.jpg'), alt: 'Outil 1 : Notre plan familial' },
]

export const gallery = {
  eyebrow: 'Feuilletez le guide',
  title: 'Clair, illustré, applicable dès ce soir.',
  text: 'Des chapitres courts, des tableaux de repères et des encadrés « phrases prêtes à dire ».',
}

export const journey = {
  eyebrow: 'Le plan',
  title: 'Quatorze jours.',
  titleAccent: 'Un pas par jour.',
  text: "Trois temps : observer, préparer, appliquer. Si vous ne tenez pas un jour, ne recommencez pas à zéro : reprenez simplement là où vous en étiez.",
}

export const stats = [
  { value: 25, suffix: '', label: 'pages de guide' },
  { value: 14, suffix: '', label: 'jours de plan' },
  { value: 30, suffix: '', label: "cartes d'idées, pour 3 âges" },
  { value: 3, suffix: '', label: 'affiches à imprimer' },
]

export const included = {
  eyebrow: 'Ce que vous recevez',
  title: "Le guide, et tout ce qu'il faut pour l'appliquer.",
  items: [
    { tag: 'Guide', title: 'Le guide PDF de 25 pages', text: '8 chapitres courts, à lire en une soirée.', image: 'sommaire' },
    { tag: 'Plan', title: 'Le plan en 14 jours', text: 'Un pas par jour, et 3 outils : plan familial, carnet d\'une semaine, fiche anti-crise.', image: 'defi14' },
    {
      tag: 'Bonus 1',
      title: '3 affiches à imprimer',
      text: 'Notre plan familial, quand on éteint : les 5 temps, et mon défi de 14 jours.',
      image: 'cinqTemps',
    },
    { tag: 'Bonus 2', title: "30 cartes d'idées sans écran", text: 'À piocher quand il dit « je m\'ennuie ». Trois couleurs, trois âges : 2–5, 6–9 et 10–14 ans.', image: 'cartes' },
    {
      tag: 'Bonus 3',
      title: 'La fiche pour les grands-parents et la nounou',
      text: '« Les écrans chez nous : mode d\'emploi », pour que tout le monde applique les mêmes règles.',
      image: 'fiche',
    },
  ],
}

export const finale = {
  eyebrow: 'Mon enfant et les écrans',
  title: 'Reprenez la main.',
  titleAccent: 'Sans cris ni guerre.',
  text: 'Le guide, le plan en 14 jours et les 3 bonus.',
  cta: 'Obtenir le guide',
}

export type Review = { name?: string; rating?: number; title: string; text: string }

/**
 * Avis de parents ayant testé le guide avant sa sortie (textes fournis tels quels,
 * prénoms modifiés à la demande des testeurs). Un avis sans prénom est signé « Parent testeur » ;
 * un avis sans note n'affiche pas d'étoiles et n'entre pas dans la moyenne.
 * Note : la moyenne et le nombre de notes sont repris dans shopify/snippets/seo.liquid.
 */
export const reviews: { eyebrow: string; title: string; source: string; items: Review[] } = {
  eyebrow: "Ils l'ont testé",
  title: 'Ce qu’en disent les parents',
  source:
    'Avis recueillis auprès de parents ayant testé le guide avant sa sortie. Prénoms modifiés pour préserver l’anonymat des testeurs.',
  items: [
    { name: 'Sophie', rating: 5, title: 'Des conseils faciles à suivre', text: 'J’ai aimé la structure du guide et les étapes progressives. Cela donne des pistes concrètes pour mieux gérer les écrans à la maison.' },
    { name: 'Camille', rating: 5, title: 'Une lecture rassurante', text: 'Le guide aborde un sujet qui peut être compliqué pour les parents avec des conseils accessibles et faciles à comprendre.' },
    { name: 'Julie', rating: 5, title: 'De bonnes idées d’activités', text: 'J’y ai trouvé des idées pour proposer davantage d’activités à mon enfant sans toujours passer par les écrans.' },
    { name: 'Thomas', rating: 4, title: 'Un bon point de départ', text: 'Le programme est bien organisé. Il faut adapter certaines idées à son quotidien, mais les conseils sont intéressants.' },
    { name: 'Émilie', rating: 5, title: 'Clair et pratique', text: 'J’apprécie le format sur 14 jours qui permet de prendre le temps de mettre en place de nouvelles habitudes.' },
    { name: 'Laura', rating: 5, title: 'Des repères utiles', text: 'Ce guide m’a aidée à réfléchir aux règles que nous voulons appliquer en famille et à mieux structurer notre routine.' },
    { name: 'Marine', rating: 4, title: 'Simple à comprendre', text: 'Le contenu est accessible et va à l’essentiel. J’aurais aimé encore plus d’exemples selon l’âge des enfants.' },
    { title: 'Une approche progressive', text: 'J’aime l’idée d’avancer petit à petit plutôt que de vouloir tout changer du jour au lendemain.' },
    { name: 'Nathalie', rating: 5, title: 'Utile au quotidien', text: 'Les conseils sont faciles à relire et à garder en tête lorsqu’on cherche à instaurer de meilleures habitudes.' },
    { name: 'Mélanie', rating: 4, title: 'Des pistes intéressantes', text: 'Un guide bien présenté qui donne plusieurs idées à essayer à la maison. La régularité reste importante.' },
    { name: 'Aurélie', rating: 5, title: 'Un guide encourageant', text: 'J’ai apprécié le ton bienveillant et les suggestions concrètes pour accompagner les enfants dans leurs habitudes numériques.' },
    { name: 'David', rating: 5, title: 'Une bonne organisation', text: 'Le plan permet de réfléchir aux habitudes familiales étape par étape. C’est pratique d’avoir une trame à suivre.' },
    { name: 'Pauline', rating: 4, title: 'Pratique et accessible', text: 'Le guide est facile à parcourir et propose une base utile pour commencer à mieux encadrer les écrans.' },
    { name: 'Céline', rating: 5, title: 'Des idées à tester en famille', text: 'J’ai retenu plusieurs suggestions pour varier les activités et rendre les moments sans écran plus faciles à organiser.' },
    { name: 'Maxime', rating: 5, title: 'Un contenu pertinent', text: 'Le sujet est très actuel et le guide propose une démarche structurée pour les parents qui souhaitent agir progressivement.' },
    { name: 'Isabelle', rating: 4, title: 'Une lecture utile', text: 'Les explications sont simples. Certaines idées demandent un peu d’organisation, mais le contenu reste intéressant.' },
    { name: 'Manon', rating: 5, title: 'Un format motivant', text: 'Le découpage sur deux semaines rend l’objectif plus facile à envisager et permet de se concentrer sur une étape à la fois.' },
    { name: 'Julien', rating: 5, title: 'Des conseils concrets', text: 'J’ai apprécié les pistes pratiques plutôt que de longues explications théoriques. C’est un bon support pour les parents.' },
    { name: 'Sarah', rating: 4, title: 'Un guide bien pensé', text: 'Le contenu est agréable à lire et donne des idées pour réfléchir aux règles familiales autour des écrans.' },
    { name: 'Élodie', rating: 5, title: 'Une ressource rassurante', text: 'Ce guide donne une structure pour commencer à faire évoluer les habitudes en famille, sans chercher la perfection immédiatement.' },
    { rating: 5, title: 'Un guide très concret', text: 'J’ai apprécié les conseils simples à appliquer au quotidien. Le plan sur 14 jours permet d’avancer étape par étape sans vouloir tout changer d’un coup.' },
    { rating: 5, title: 'Des idées faciles à mettre en place', text: 'Le guide m’a donné des idées pour proposer d’autres activités à mon enfant et mieux organiser les moments avec les écrans.' },
    { rating: 5, title: 'Une bonne aide pour les parents', text: 'J’avais besoin de repères pour instaurer des règles plus claires à la maison. J’aime le côté pratique et la progression du programme.' },
    { rating: 4, title: 'Utile et facile à lire', text: 'Le contenu est clair et les conseils sont accessibles. Il faut prendre le temps de les adapter à son enfant, mais c’est une bonne base.' },
    { rating: 4, title: 'Des pistes intéressantes', text: 'J’ai trouvé plusieurs idées intéressantes pour réduire progressivement le temps d’écran. Cela demande de la régularité, mais le guide aide à mieux s’organiser.' },
  ],
}
