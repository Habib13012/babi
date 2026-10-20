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
