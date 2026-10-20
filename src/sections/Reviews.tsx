import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { reviews } from '../content'

type Props = { reducedMotion: boolean }

const average = reviews.items.reduce((sum, r) => sum + r.rating, 0) / reviews.items.length
const averageLabel = average.toLocaleString('fr-FR', { maximumFractionDigits: 1 })

const STAR = 'M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z'

/** Étoiles avec remplissage partiel (4,6 → 4 pleines et une à 60 %). */
function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i))
        return (
          <span key={i} className="relative h-4 w-4">
            <svg viewBox="0 0 20 20" className="absolute inset-0 h-4 w-4 text-paper/20">
              <path fill="currentColor" d={STAR} />
            </svg>
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-ember">
                <path fill="currentColor" d={STAR} />
              </svg>
            </span>
          </span>
        )
      })}
    </span>
  )
}

function Card({ r }: { r: (typeof reviews.items)[number] }) {
  return (
    <figure className="flex w-[78vw] max-w-[380px] shrink-0 flex-col gap-4 rounded-[22px] border border-paper/10 bg-paper/[0.04] p-6 md:w-[360px] md:p-7">
      <Stars rating={r.rating} />
      <blockquote>
        <p className="text-lg leading-snug font-extrabold tracking-tight text-paper">{r.title}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-paper/70">{r.text}</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-2 text-xs font-semibold tracking-wide text-paper/50">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ember/15 text-ember" aria-hidden="true">
          ✓
        </span>
        Parent testeur · {r.rating}/5
      </figcaption>
    </figure>
  )
}

/** Avis de parents : bandeau qui défile doucement (statique si l'utilisateur limite les animations). */
export function Reviews({ reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('[data-r-head] > *', {
        autoAlpha: 0,
        y: 40,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 45%', scrub: 0.6 },
      })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section id="reviews" ref={root} aria-labelledby="reviews-title" className="relative z-10 overflow-hidden bg-ink py-24 md:py-36">
      <div data-r-head className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <p className="eyebrow text-ember">{reviews.eyebrow}</p>
        <h2 id="reviews-title" className="display mt-4 text-[clamp(2.3rem,5vw,4.4rem)] text-paper">
          {reviews.title}
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="display text-4xl text-paper">{averageLabel}</span>
          <span className="flex flex-col gap-1">
            <Stars rating={average} />
            <span className="text-sm text-paper/60">
              Note moyenne sur 5 · {reviews.items.length} avis
            </span>
          </span>
        </div>
      </div>

      {reducedMotion ? (
        <div className="mx-auto mt-12 flex max-w-[1440px] flex-wrap gap-5 px-4 sm:px-8">
          {reviews.items.map((r) => (
            <Card key={r.title} r={r} />
          ))}
        </div>
      ) : (
        <div className="reviews-marquee mt-12 md:mt-16" role="list">
          <div className="reviews-track flex w-max gap-5">
            {[...reviews.items, ...reviews.items].map((r, i) => (
              <div key={i} role={i < reviews.items.length ? 'listitem' : undefined} aria-hidden={i >= reviews.items.length || undefined}>
                <Card r={r} />
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mx-auto mt-8 max-w-[1440px] px-4 text-xs text-paper/45 sm:px-8">{reviews.source}</p>

      <style>{`
        .reviews-marquee{mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
        .reviews-track{padding-inline:20px;animation:reviews-scroll 55s linear infinite}
        .reviews-marquee:hover .reviews-track,.reviews-marquee:focus-within .reviews-track{animation-play-state:paused}
        @keyframes reviews-scroll{to{transform:translateX(-50%)}}
      `}</style>
    </section>
  )
}
