import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { site } from '../config'

/** Barre d'achat mobile : apparaît après l'ouverture, disparaît sur le final (qui a déjà son bouton). */
export function StickyBuy() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    gsap.set(el, { yPercent: 120 })
    const show = (v: boolean) => gsap.to(el, { yPercent: v ? 0 : 120, duration: 0.5, ease: 'expo.out' })
    ScrollTrigger.create({
      trigger: '#moment',
      start: 'top 40%',
      endTrigger: '#finale',
      end: 'top 70%',
      onToggle: (self) => show(self.isActive),
    })
  })

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-paper/10 bg-ink/85 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm leading-tight font-extrabold text-paper">{site.title}</p>
        <a href={site.buyUrl} className="btn-ember shrink-0 px-4 py-2.5 text-sm">
          Le guide <span className="tabular-nums">{site.price}</span>
        </a>
      </div>
    </div>
  )
}
