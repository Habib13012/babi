import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { discover } from '../content'
import { media } from '../config'

type Props = { use3D: boolean; reducedMotion: boolean }

/**
 * Découverte : section épinglée. Le livre fait un tour complet (face, dos, tranche)
 * puis s'ouvre ; les annotations suivent exactement la même progression de scroll
 * que la chorégraphie 3D (voir three/choreography.ts, section « discover »).
 */
export function Discover({ use3D, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? true : 0.5,
        },
      })
      // Timeline normalisée sur 1 unité = toute la section
      tl.fromTo('[data-d-intro] > *', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.1 }, 0.02)
      const notes = gsap.utils.toArray<HTMLElement>('[data-d-note]')
      notes.forEach((note, i) => {
        tl.fromTo(
          note,
          { autoAlpha: 0, x: -40 },
          { autoAlpha: 1, x: 0, duration: 0.07 },
          0.2 + i * 0.11,
        )
      })
      tl.fromTo('[data-d-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.36, ease: 'none' }, 0.2)
      tl.to(['[data-d-intro]', '[data-d-notes]'], { autoAlpha: 0, y: -40, duration: 0.06, ease: 'power2.in' }, 0.6)
      tl.fromTo('[data-d-open] > *', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.1 }, 0.7)
      tl.fromTo('[data-d-spot]', { autoAlpha: 0.35, scale: 0.8 }, { autoAlpha: 1, scale: 1.1, duration: 0.9, ease: 'none' }, 0)
      tl.to({}, { duration: 0.05 }, 0.95)
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section id="discover" ref={root} aria-labelledby="discover-title" className="relative h-[520vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          data-d-spot
          aria-hidden="true"
          className="absolute top-[62%] left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(169,184,198,0.18),transparent_65%)] md:top-1/2 md:left-[66%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
        />

        <div className="relative mx-auto grid h-full w-full max-w-[1440px] px-4 pt-20 sm:px-8 md:items-center md:pt-0">
          {/* Phase 1 : présentation + annotations pendant la rotation */}
          <div className="col-start-1 row-start-1 max-w-[460px] self-start md:self-center">
            <div data-d-intro>
              <p className="eyebrow text-ember">{discover.eyebrow}</p>
              <h2 id="discover-title" className="display mt-4 text-[clamp(2.2rem,5vw,4.4rem)] text-paper">
                {discover.title}
              </h2>
            </div>
            <div data-d-notes className="relative mt-6 pl-6 md:mt-12">
              <div aria-hidden="true" className="absolute top-1 bottom-1 left-0 w-px bg-paper/15">
                <div data-d-rule className="h-full w-full origin-top bg-ember" />
              </div>
              <ul className="flex flex-row gap-5 md:flex-col md:gap-7">
                {discover.notes.map((n) => (
                  <li key={n.value} data-d-note className="min-w-0 flex-1">
                    <span className="display block text-[clamp(1.6rem,3.6vw,3rem)] text-paper">{n.value}</span>
                    <span className="mt-1 block text-xs leading-snug text-paper/65 md:text-base">{n.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phase 2 : le livre s'ouvre */}
          <div
            data-d-open
            className="col-start-1 row-start-1 max-w-[440px] self-start md:self-center"
          >
            <p className="eyebrow text-ember">À l'intérieur</p>
            <h3 className="display mt-4 text-[clamp(2.2rem,5vw,4.4rem)] text-paper">{discover.openTitle}</h3>
            <p className="mt-5 text-[15px] leading-relaxed text-paper/75 md:text-lg">{discover.openText}</p>
          </div>
        </div>

        {!use3D && (
          <img
            src={media.mockup}
            alt=""
            loading="lazy"
            width={715}
            height={803}
            className="absolute bottom-[4%] left-1/2 h-[40%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] md:top-1/2 md:bottom-auto md:left-[66%] md:h-[70%] md:-translate-y-1/2"
          />
        )}
      </div>
    </section>
  )
}
