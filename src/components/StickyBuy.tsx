import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { site } from '../config'
import { DiscountBadge } from './Price'

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
        <div className="min-w-0">
          <p className="truncate text-sm leading-tight font-extrabold text-paper">{site.title}</p>
          {site.comparePrice && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-paper/55">
              <s>{site.comparePrice}</s>
              <DiscountBadge />
            </p>
          )}
        </div>
        <a href={site.buyUrl} className="btn-ember buy-shine shrink-0 overflow-hidden px-4 py-2.5 text-sm">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" className="buy-icon-bounce">
            <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          Télécharger <span className="tabular-nums">· {site.price}</span>
        </a>
      </div>
    </div>
  )
}
