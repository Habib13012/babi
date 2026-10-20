/**
 * Calendrier de la section « Découverte » (progression 0 → 1 de la zone épinglée).
 * Partagé entre la chorégraphie 3D (pages qui tournent) et les légendes du DOM,
 * pour que texte et livre restent exactement synchronisés.
 */

/** Nombre de feuilles qui tournent (chacune porte 2 pages, recto/verso). */
export const LEAVES = 5
/** Nombre de doubles pages visibles une fois le livre ouvert. */
export const SPREADS = LEAVES + 1

export const SPIN_START = 0.03
export const SPIN_END = 0.16
export const OPEN_START = 0.2
export const OPEN_END = 0.26
export const SPREAD_LEN = 0.105
export const CLOSE_START = OPEN_END + SPREADS * SPREAD_LEN // 0.89
export const CLOSE_END = CLOSE_START + 0.055

/** Dans la fenêtre d'une double page : moment où la feuille commence / finit de tourner. */
export const TURN_FROM = 0.6
export const TURN_TO = 0.96

export const spreadStart = (k: number) => OPEN_END + k * SPREAD_LEN

export type ReadingStage = { kind: 'intro' } | { kind: 'spread'; index: number } | { kind: 'final' }

export function stageAt(p: number): ReadingStage {
  if (p < OPEN_START) return { kind: 'intro' }
  if (p >= CLOSE_START) return { kind: 'final' }
  // la légende change à mi-chemin du tournage de la page
  const midTurn = (TURN_FROM + TURN_TO) / 2
  const k = Math.min(SPREADS - 1, Math.max(0, Math.floor((p - OPEN_END) / SPREAD_LEN + 1 - midTurn)))
  return { kind: 'spread', index: k }
}
