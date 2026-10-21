import { reviews, type Review } from '../content'

export const rated = reviews.items.filter((r): r is Review & { rating: number } => typeof r.rating === 'number')
export const average = rated.reduce((sum, r) => sum + r.rating, 0) / rated.length
// vitesse du bandeau constante quel que soit le nombre d'avis (~35 px/s)
export const MARQUEE_SECONDS = Math.round((reviews.items.length * 380) / 35)
export const averageLabel = average.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
