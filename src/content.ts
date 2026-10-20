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
  openTitle: 'Le plan en 14 jours.',
  openText: 'Un pas par jour. Des consignes concrètes, des phrases prêtes à dire et des outils pour toute la maison.',
}

export const pillars = [
  {
    index: '01',
    title: 'Règles claires',
    text: "Des repères simples, adaptés à l'âge de votre enfant, de 2 à 14 ans, que toute la famille comprend et peut tenir dans la durée.",
    visual: { kind: 'photo', position: '30% 50%', zoom: 1 },
    alt: 'Une mère agenouillée face à son jeune fils, souriants, dans un salon baigné de lumière.',
  },
  {
    index: '02',
    title: 'Phrases prêtes à dire',
    text: "Les mots à dire pendant la crise, quand on n'a plus d'idées ni de patience.",
    visual: { kind: 'photo', position: '52% 42%', zoom: 1.55 },
    alt: 'Gros plan sur une mère et son fils qui se regardent en souriant.',
  },
  {
    index: '03',
    title: 'Outils à imprimer',
    text: "Des affiches à accrocher et des cartes d'idées pour remplacer l'écran, pour que le plan vive au quotidien.",
    visual: { kind: 'sheets' },
    alt: '',
  },
] as const

/** Titres des supports imprimables, tels qu'annoncés dans la fiche produit. */
export const printables = ['Le plan familial', 'Les 5 temps', 'Le défi de 14 jours']

export const journey = {
  eyebrow: 'Le plan',
  title: 'Quatorze jours.',
  titleAccent: 'Un pas par jour.',
  text: "Pas de révolution du jour au lendemain : une progression pensée pour que chacun s'adapte, enfants comme parents.",
  end: 'Jour 14 : vous avez repris la main.',
}

export const stats = [
  { value: 25, suffix: '', label: 'pages de guide' },
  { value: 14, suffix: '', label: 'jours de plan' },
  { value: 30, suffix: '', label: "cartes d'idées" },
  { value: 3, suffix: '', label: 'affiches à imprimer' },
]

export const included = {
  eyebrow: 'Ce que vous recevez',
  title: "Le guide, et tout ce qu'il faut pour l'appliquer.",
  items: [
    { tag: 'Guide', title: 'Le guide PDF de 25 pages', text: 'À lire en une soirée.' },
    { tag: 'Plan', title: 'Le plan en 14 jours', text: 'Un pas par jour.' },
    {
      tag: 'Bonus 1',
      title: '3 affiches à imprimer',
      text: 'Le plan familial, les 5 temps, le défi de 14 jours.',
    },
    { tag: 'Bonus 2', title: "30 cartes d'idées", text: "Pour remplacer l'écran." },
    {
      tag: 'Bonus 3',
      title: 'La fiche pour les grands-parents et la nounou',
      text: 'Pour que tout le monde applique les mêmes règles.',
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
