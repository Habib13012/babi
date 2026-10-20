import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { included, stats } from '../content'
import { media } from '../config'

type Props = { reducedMotion: boolean }

const THUMBS: Record<string, string> = {
  sommaire: media.sommaire,
  defi14: media.bonus.defi14,
  cinqTemps: media.bonus.cinqTemps,
  cartes: media.bonus.cartes,
  fiche: media.bonus.fiche,
}

export function Included({ reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Compteurs : la valeur suit le défilement (et se rembobine en remontant)
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        if (reducedMotion) {
          el.textContent = String(end)
          return
        }
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          ease: 'none',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: 0.5 },
        })
      })
      if (reducedMotion) return

      gsap.fromTo(
        '[data-i-mockup]',
        { yPercent: 12, rotate: -4 },
        {
          yPercent: -10,
          rotate: 3,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-i-item]').forEach((item) => {
        gsap.from(item, {
          autoAlpha: 0,
          y: 50,
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top 95%', end: 'top 70%', scrub: 0.5 },
        })
        gsap.from(item.querySelector('[data-i-line]'), {
          scaleX: 0,
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top 90%', end: 'top 60%', scrub: 0.5 },
        })
      })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section
      id="included"
      ref={root}
      aria-labelledby="included-title"
      className="relative z-10 rounded-b-[32px] bg-paper text-navy md:rounded-b-[56px]"
    >
      {/* Chiffres clés */}
      <div className="mx-auto max-w-[1440px] px-4 pt-24 sm:px-8 md:pt-36">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-10 border-y border-navy/10 py-12 md:grid-cols-4 md:py-16">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2">
              <dt className="text-sm font-semibold text-navy/60 md:text-base">{s.label}</dt>
              <dd className="display text-[clamp(3.4rem,8vw,7rem)] tabular-nums">
                <span data-count={s.value}>{s.value}</span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-14 px-4 pt-20 pb-28 sm:px-8 md:grid-cols-12 md:gap-10 md:pt-32 md:pb-40">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="eyebrow text-teal">{included.eyebrow}</p>
            <h2 id="included-title" className="display mt-5 text-[clamp(2.3rem,4.8vw,4.4rem)]">
              {included.title}
            </h2>
            <div className="relative mx-auto mt-10 w-[min(360px,80%)] md:mx-0">
              <div
                aria-hidden="true"
                className="absolute inset-x-[10%] bottom-[2%] h-[12%] rounded-[50%] bg-navy/25 blur-2xl"
              />
              <img
                data-i-mockup
                src={media.mockup}
                alt="Le guide « Mon enfant et les écrans » en format livre"
                loading="lazy"
                decoding="async"
                width={715}
                height={803}
                className="relative w-full"
              />
            </div>
          </div>
        </div>

        <ol className="md:col-span-6 md:col-start-7">
          {included.items.map((item, i) => (
            <li key={item.title} data-i-item className="relative py-8 md:py-10">
              <span data-i-line aria-hidden="true" className="absolute inset-x-0 top-0 block h-px origin-left bg-navy/15" />
              <div className="flex items-start gap-5 md:gap-8">
                <span className="display w-10 shrink-0 pt-1 text-2xl text-ember tabular-nums md:text-3xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.16em] uppercase ${
                      item.tag.startsWith('Bonus') ? 'bg-ember/15 text-[#b4581a]' : 'bg-navy/8 text-navy/70'
                    }`}
                  >
                    {item.tag}
                  </span>
                  <h3 className="mt-3 text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight font-extrabold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base text-navy/65 md:text-lg">{item.text}</p>
                </div>
                <img
                  src={THUMBS[item.image]}
                  alt={`Aperçu : ${item.title}`}
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={1273}
                  className="w-16 shrink-0 rotate-2 rounded-[3px] shadow-[0_14px_30px_-12px_rgba(18,40,62,0.55)] ring-1 ring-navy/10 transition-transform duration-500 hover:rotate-0 sm:w-24"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
