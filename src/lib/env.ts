export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Vérifie que WebGL est réellement utilisable avant de monter la scène 3D. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export const isMobileViewport = (): boolean => window.innerWidth < 768

/**
 * Téléphones et tablettes (écran tactile ou petit écran) : pas de scène 3D.
 * Le livre en image s'affiche tout de suite, sans télécharger three.js
 * (les visiteurs venus des pubs ouvrent la page dans le navigateur de Facebook/Instagram, souvent en 4G).
 */
export const isLightDevice = (): boolean =>
  window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
