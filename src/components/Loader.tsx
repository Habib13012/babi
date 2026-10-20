import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { setScrollLocked } from '../lib/smoothScroll'

type Props = { ready: boolean; reducedMotion: boolean; onDone: () => void }

/** Rideau d'ouverture : reste en place le temps que la scène soit prête, puis se lève. */
export function Loader({ ready, reducedMotion, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    setScrollLocked(true)
    window.scrollTo(0, 0)
    return () => setScrollLocked(false)
  }, [])

  useEffect(() => {
    if (!ready) return
    const finish = () => {
      setScrollLocked(false)
      setGone(true)
    }
    if (reducedMotion) {
      finish()
      onDone()
      return
    }
    const tl = gsap.timeline({ onComplete: finish })
    tl.to(line.current, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '+=0.1')
      // le contenu démarre pendant que le rideau se lève
      .add(() => onDone(), '-=0.7')
    return () => {
      tl.kill()
    }
  }, [ready, reducedMotion, onDone])

  if (gone) return null

  return (
    <div
      ref={root}
      className="grain fixed inset-0 z-[100] grid place-items-center bg-navy"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      role="status"
      aria-live="polite"
    >
      <div className="w-[min(320px,70vw)] text-center">
        <p className="eyebrow text-ember">Guide pratique pour les parents</p>
        <p className="mt-3 text-2xl font-extrabold tracking-tight text-paper">Mon enfant et les écrans</p>
        <div className="relative mt-6 h-px overflow-hidden bg-paper/15">
          <div ref={line} className="absolute inset-0 origin-left scale-x-0 bg-ember" />
          {!ready && <div className="absolute inset-y-0 w-1/3 animate-[loader_1.2s_ease-in-out_infinite] bg-ember/60" />}
        </div>
        <span className="sr-only">{ready ? 'Chargement terminé' : 'Chargement…'}</span>
      </div>
      <style>{`@keyframes loader{0%{left:-35%}100%{left:100%}}`}</style>
    </div>
  )
}
