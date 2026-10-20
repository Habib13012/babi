import { useRef } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'
import { discover } from '../content'
import { media, site } from '../config'
import { BuyButton } from '../components/BuyButton'
import { SPREADS, stageAt } from '../three/reading'

type Props = { use3D: boolean; reducedMotion: boolean }

const CAPTION =
  'col-start-1 row-start-1 self-start md:self-center invisible translate-y-6 opacity-0 transition-[opacity,transform,visibility] duration-700 ease-[var(--ease-out-expo)] data-[active]:visible data-[active]:translate-y-0 data-[active]:opacity-100'

/**
 * Découverte : section épinglée. Le livre fait un tour, s'ouvre, ses pages se tournent
 * une à une au fil du scroll, puis il se referme sur l'offre complète.
 * Les légendes suivent le même calendrier que la 3D (three/reading.ts).
 */
export function Discover({ use3D, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const captions = Array.from(el.querySelectorAll<HTMLElement>('[data-caption]'))
      const dots = Array.from(el.querySelectorAll<HTMLElement>('[data-dot]'))
      const dotsBar = el.querySelector<HTMLElement>('[data-dots]')
      let last = ''

      const apply = (p: number) => {
        const stage = stageAt(p)
        const key = stage.kind === 'spread' ? `spread-${stage.index}` : stage.kind
        if (key === last) return
        last = key
        for (const c of captions) {
          const active = c.dataset.caption === key
          c.toggleAttribute('data-active', active)
          c.setAttribute('aria-hidden', String(!active))
        }
        dotsBar?.toggleAttribute('data-active', stage.kind === 'spread')
        dots.forEach((d, i) => d.toggleAttribute('data-on', stage.kind === 'spread' && i <= stage.index))
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      })
      apply(st.progress)
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section id="discover" ref={root} aria-labelledby="discover-title" className="relative h-[1300vh]">
      {/* Ancre « extrait » (liens du blog) : arrive sur le livre ouvert */}
      <span id="extrait" aria-hidden="true" className="absolute top-[324vh] left-0 h-px w-px" />
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-[64%] left-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(169,184,198,0.16),transparent_65%)] md:top-1/2 md:left-[62%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
        />

        <div className="relative mx-auto grid h-full w-full max-w-[1440px] px-4 pt-20 sm:px-8 md:items-center md:pt-0">
          {/* Présentation, pendant que le livre tourne */}
          <div data-caption="intro" className={`${CAPTION} max-w-[460px]`}>
            <p className="eyebrow text-ember">{discover.eyebrow}</p>
            <h2 id="discover-title" className="display mt-4 text-[clamp(2.2rem,5vw,4.4rem)] text-paper">
              {discover.title}
            </h2>
            <ul className="mt-6 flex flex-row gap-5 border-l border-ember/60 pl-5 md:mt-12 md:flex-col md:gap-7">
              {discover.notes.map((n) => (
                <li key={n.value} className="min-w-0 flex-1">
                  <span className="display block text-[clamp(1.6rem,3.6vw,3rem)] text-paper">{n.value}</span>
                  <span className="mt-1 block text-xs leading-snug text-paper/65 md:text-base">{n.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Une légende par double page */}
          {discover.spreads.map((s, i) => (
            <div key={i} data-caption={`spread-${i}`} aria-hidden="true" className={`${CAPTION} max-w-[420px]`}>
              <p className="eyebrow text-ember">{s.eyebrow}</p>
              <h3 className="display mt-3 text-[clamp(1.8rem,4vw,3.6rem)] text-paper md:mt-4">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/75 md:mt-5 md:text-lg">{s.text}</p>
            </div>
          ))}

          {/* Le livre se referme : l'offre complète */}
          <div data-caption="final" aria-hidden="true" className={`${CAPTION} max-w-[460px]`}>
            <p className="eyebrow text-ember">{discover.final.eyebrow}</p>
            <h3 className="display mt-3 text-[clamp(2.2rem,5vw,4.6rem)] text-paper md:mt-4">{discover.final.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/75 md:mt-5 md:text-lg">{discover.final.text}</p>
            <div className="mt-5 md:mt-8">
              <BuyButton label={discover.final.cta} />
            </div>
            <span className="sr-only">Prix : {site.price}</span>
          </div>
        </div>

        {/* Progression dans le feuilletage */}
        <div
          data-dots
          aria-hidden="true"
          className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-2 opacity-0 transition-opacity duration-500 data-[active]:opacity-100 sm:bottom-8"
        >
          {Array.from({ length: SPREADS }, (_, i) => (
            <span
              key={i}
              data-dot
              className="h-1.5 w-6 rounded-full bg-paper/20 transition-colors duration-500 data-[on]:bg-ember"
            />
          ))}
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
