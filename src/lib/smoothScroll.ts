import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null
let locked = false

/** Défilement fluide synchronisé avec ScrollTrigger (désactivé si mouvement réduit). */
export function startSmoothScroll(): () => void {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true })
  // l'écran de chargement a pu verrouiller le défilement avant la création de Lenis
  if (locked) lenis.stop()
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'auto' })
  }
}

/**
 * Verrouille ou libère le défilement. Le style natif et Lenis sont toujours traités ensemble :
 * l'ordre d'initialisation (chargement vs Lenis) ne doit jamais laisser la page bloquée.
 */
export function setScrollLocked(value: boolean) {
  locked = value
  document.documentElement.style.overflow = value ? 'hidden' : ''
  if (lenis) {
    if (value) lenis.stop()
    else lenis.start()
  }
}
