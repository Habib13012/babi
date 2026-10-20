import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { setScrollLocked } from '../lib/smoothScroll'
import { site } from '../config'

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
      <div className="flex w-[min(320px,70vw)] flex-col items-center text-center">
        {/* Emblème animé : le livre s'ouvre et se referme, le soleil se lève */}
        <svg viewBox="0 0 48 48" aria-hidden="true" className="loader-mark h-24 w-24 drop-shadow-[0_18px_40px_rgba(232,132,60,0.25)]">
          <rect width="48" height="48" rx="12" fill="#f4f2ec" />
          <circle className="loader-sun" cx="24" cy="15.5" r="4.5" fill="#e8843c" />
          <path className="loader-page loader-page--left" d="M8 21.5c6.2-1.6 11.6-.9 15 2.4V38c-3.4-3-8.8-3.7-15-2.2z" fill="#12283e" />
          <path className="loader-page loader-page--right" d="M40 21.5c-6.2-1.6-11.6-.9-15 2.4V38c3.4-3 8.8-3.7 15-2.2z" fill="#12283e" />
        </svg>
        <p className="mt-6 text-2xl font-extrabold tracking-tight text-paper">
          {site.brand.split(' ')[0]}{' '}
          <span className="serif-accent text-[1.15em] font-normal text-ember">{site.brand.split(' ').slice(1).join(' ')}</span>
        </p>
        <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-paper/50 uppercase">{site.title}</p>
        <div className="relative mt-6 h-px w-full overflow-hidden bg-paper/15">
          <div ref={line} className="absolute inset-0 origin-left scale-x-0 bg-ember" />
          {!ready && <div className="absolute inset-y-0 w-1/3 animate-[loader_1.2s_ease-in-out_infinite] bg-ember/60" />}
        </div>
        <span className="sr-only">{ready ? 'Chargement terminé' : 'Chargement…'}</span>
      </div>
      <style>{`
        @keyframes loader{0%{left:-35%}100%{left:100%}}
        .loader-mark{animation:loader-breathe 2.4s ease-in-out infinite}
        .loader-sun{transform-box:fill-box;transform-origin:center;animation:loader-sun 2.4s ease-in-out infinite}
        .loader-page{transform-box:fill-box;animation:loader-page 2.4s cubic-bezier(.65,0,.35,1) infinite}
        .loader-page--left{transform-origin:right center}
        .loader-page--right{transform-origin:left center;animation-delay:.15s}
        @keyframes loader-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes loader-sun{0%,100%{transform:translateY(5px) scale(.85);opacity:.55}50%{transform:translateY(-1px) scale(1.08);opacity:1}}
        @keyframes loader-page{0%,100%{transform:scaleX(1)}45%,55%{transform:scaleX(.55) skewY(-6deg)}}
        @media (prefers-reduced-motion: reduce){.loader-mark,.loader-sun,.loader-page{animation:none}}
      `}</style>
    </div>
  )
}
