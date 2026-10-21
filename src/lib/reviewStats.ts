import { reviews } from '../content'

// Note et nombre d'avis : l'ensemble des avis recueillis, pas seulement la sélection affichée
export const average = reviews.total.average
export const reviewCount = reviews.total.count
// vitesse du bandeau constante quel que soit le nombre d'avis (~35 px/s)
export const MARQUEE_SECONDS = Math.round((reviews.items.length * 380) / 35)
export const averageLabel = average.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
