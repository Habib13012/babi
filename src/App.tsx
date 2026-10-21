import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { hasWebGL, isLightDevice, prefersReducedMotion } from './lib/env'
import { scrollToTarget, startSmoothScroll } from './lib/smoothScroll'
import { interaction } from './three/choreography'
import { media } from './config'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { StickyBuy } from './components/StickyBuy'
import { Hero } from './sections/Hero'
import { Moment } from './sections/Moment'
import { Discover } from './sections/Discover'
import { Pillars } from './sections/Pillars'
import { Journey } from './sections/Journey'
import { Gallery } from './sections/Gallery'
import { Included } from './sections/Included'
import { Reviews } from './sections/Reviews'
import { Finale } from './sections/Finale'

// La scène 3D (three.js) est chargée dans un fichier séparé pour ne pas bloquer le premier affichage.
const Experience = lazy(() => import('./three/Experience'))

/** Attend la police (utilisée pour dessiner les textures du livre), sans bloquer plus de 2,5 s. */
function waitForFonts() {
  const fonts = Promise.all([
    document.fonts.load('800 64px "Plus Jakarta Sans"'),
    document.fonts.load('500 32px "Plus Jakarta Sans"'),
  ])
  return Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))])
}

export default function App() {
  const [reducedMotion] = useState(prefersReducedMotion)
  const [lightDevice] = useState(isLightDevice)
  const [webgl, setWebgl] = useState(() => !lightDevice && hasWebGL())
  const [fontsReady, setFontsReady] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    waitForFonts().then(() => setFontsReady(true))
  }, [])

  // Sans 3D, on attend seulement l'image de remplacement
  useEffect(() => {
    if (webgl) return
    const img = new Image()
    img.onload = img.onerror = () => setSceneReady(true)
    img.src = media.mockup
  }, [webgl])

  // Filet de sécurité : la page ne reste jamais bloquée sur l'écran de chargement
  useEffect(() => {
    const t = window.setTimeout(() => setSceneReady(true), 4000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    return startSmoothScroll()
  }, [reducedMotion])

  // Inclinaison du livre selon la position de la souris (pointeurs précis uniquement)
  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      interaction.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      interaction.pointerY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  // Les polices modifient la hauteur des blocs : on recalcule les déclencheurs
  useEffect(() => {
    if (fontsReady) ScrollTrigger.refresh()
  }, [fontsReady])

  const onSceneReady = useCallback(() => setSceneReady(true), [])
  const onIntroDone = useCallback(() => setIntroDone(true), [])

  // Lien entrant avec ancre (ex. /#extrait depuis le blog) : la section n'existait pas
  // encore au chargement, on y défile une fois l'ouverture terminée
  useEffect(() => {
    if (!introDone || !window.location.hash) return
    const target = document.querySelector<HTMLElement>(window.location.hash)
    if (target) window.setTimeout(() => scrollToTarget(target), 300)
  }, [introDone])
  const disable3D = useCallback(() => setWebgl(false), [])

  return (
    <>
      <a
        href="#discover"
        className="sr-only z-[200] rounded-full bg-ember px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller au contenu
      </a>
      <Loader ready={sceneReady} reducedMotion={reducedMotion} quick={lightDevice} onDone={onIntroDone} />

      {webgl && fontsReady && (
        <ErrorBoundary onError={disable3D}>
          <Suspense fallback={null}>
            <Experience reducedMotion={reducedMotion} onReady={onSceneReady} onContextLost={disable3D} />
          </Suspense>
        </ErrorBoundary>
      )}

      <Header />
      <main className="relative z-10">
        <Hero introDone={introDone} use3D={webgl} reducedMotion={reducedMotion} />
        <Moment reducedMotion={reducedMotion} />
        <Discover use3D={webgl} reducedMotion={reducedMotion} />
        <Pillars reducedMotion={reducedMotion} />
        <Journey reducedMotion={reducedMotion} />
        <Gallery reducedMotion={reducedMotion} />
        <Included reducedMotion={reducedMotion} />
        <Reviews reducedMotion={reducedMotion} />
        <Finale use3D={webgl} reducedMotion={reducedMotion} />
      </main>
      <StickyBuy />
    </>
  )
}
