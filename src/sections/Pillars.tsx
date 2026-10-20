import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { pillars, printables } from '../content'
import { media } from '../config'

type Props = { reducedMotion: boolean }

function Sheets() {
  // Composition typographique des supports imprimables (titres issus de la fiche produit).
  return (
    <div className="relative h-full w-full bg-navy">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(232,132,60,0.25),transparent_60%)]" />
      {printables.map((title, i) => (
        <div
          key={title}
          className="absolute top-1/2 left-1/2 w-[46%]"
          style={{
            transform: `translate(-50%,-50%) translate(${(i - 1) * 34}%, ${(i - 1) * -6}%) rotate(${(i - 1) * 8}deg)`,
            zIndex: i === 1 ? 2 : 1,
          }}
        >
          <div
            data-sheet
            className="flex aspect-[1/1.414] flex-col justify-between rounded-[6px] bg-paper p-[8%] text-navy shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <span className="text-[clamp(8px,0.9vw,11px)] font-bold tracking-[0.2em] text-ember uppercase">Affiche {i + 1}</span>
            <span className="text-[clamp(14px,1.9vw,26px)] leading-[1.05] font-extrabold tracking-tight">{title}</span>
            <span className="block h-[3px] w-1/4 bg-ember" />
          </div>
        </div>
      ))}
      <p className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wide whitespace-nowrap text-paper/70">
        + 30 cartes d'idées · 1 fiche grands-parents & nounou
      </p>
    </div>
  )
}

export function Pillars({ reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const head = SplitText.create('[data-p-heading]', { type: 'lines', linesClass: 'split-line', mask: 'lines' })
      gsap.from(head.lines, {
        yPercent: 100,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-p-heading]', start: 'top 90%', end: 'top 50%', scrub: 0.6 },
      })

      gsap.utils.toArray<HTMLElement>('[data-pillar]').forEach((el) => {
        const frame = el.querySelector('[data-p-frame]')
        const media = el.querySelector('[data-p-media]')
        const index = el.querySelector('[data-p-index]')
        const copy = el.querySelectorAll('[data-p-copy] > *')
        const sheets = el.querySelectorAll('[data-sheet]')

        // Révélation par masque synchronisée au défilement
        gsap.fromTo(
          frame,
          { clipPath: 'inset(18% 22% 18% 22% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 25%', scrub: 0.6 },
          },
        )
        gsap.fromTo(
          media,
          { scale: 1.3, yPercent: -6 },
          {
            scale: 1.02,
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.fromTo(
          index,
          { yPercent: 40 },
          {
            yPercent: -60,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.from(copy, {
          autoAlpha: 0,
          y: 60,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 35%', scrub: 0.6 },
        })
        if (sheets.length) {
          gsap.from(sheets, {
            yPercent: 60,
            autoAlpha: 0,
            stagger: 0.15,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 20%', scrub: 0.6 },
          })
        }
      })
      return () => head.revert()
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section
      id="pillars"
      ref={root}
      aria-labelledby="pillars-title"
      className="relative z-10 -mt-[1px] rounded-t-[32px] bg-paper text-navy md:rounded-t-[56px]"
    >
      <div className="mx-auto max-w-[1440px] px-4 pt-24 pb-10 sm:px-8 md:pt-40">
        <p className="eyebrow text-teal">Ce que contient le guide</p>
        <h2
          id="pillars-title"
          data-p-heading
          className="display mt-5 max-w-[14ch] text-[clamp(2.4rem,7vw,6.2rem)]"
        >
          Des outils concrets, pas de la théorie.
        </h2>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-24 px-4 pb-32 sm:px-8 md:gap-40 md:pb-48">
        {pillars.map((p, i) => (
          <article
            key={p.index}
            data-pillar
            className="relative grid items-center gap-8 md:grid-cols-12 md:gap-10"
          >
            <div
              data-p-frame
              className={`relative aspect-[4/5] overflow-hidden rounded-[28px] md:col-span-6 md:row-start-1 ${
                i % 2 ? 'md:col-start-7' : 'md:col-start-1'
              }`}
            >
              <div data-p-media className="absolute inset-0">
                {p.visual.kind === 'photo' ? (
                  <img
                    src={media.sceneFamille}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    width={1100}
                    height={630}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: p.visual.position,
                      transform: `scale(${p.visual.zoom})`,
                      transformOrigin: p.visual.position,
                    }}
                  />
                ) : (
                  <Sheets />
                )}
              </div>
            </div>

            <div
              className={`relative md:row-start-1 md:col-span-5 ${i % 2 ? 'md:col-start-1' : 'md:col-start-8'}`}
            >
              <span
                data-p-index
                aria-hidden="true"
                className="display pointer-events-none absolute -top-[0.55em] -left-[0.04em] text-[clamp(7rem,16vw,15rem)] text-navy/[0.07] select-none"
              >
                {p.index}
              </span>
              <div data-p-copy className="relative">
                <p className="eyebrow text-ember">{p.index} / 03</p>
                <h3 className="display mt-4 text-[clamp(2.2rem,4.6vw,4.2rem)]">{p.title}</h3>
                <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-navy/70 md:text-lg">{p.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
