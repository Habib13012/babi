import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { days, journey } from '../content'
import { DayIllustration } from '../components/DayIllustration'

type Props = { reducedMotion: boolean }


/** Les 14 jours défilent horizontalement pendant que la section reste épinglée. */
export function Journey({ reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const t = track.current
      if (!t) return
      const distance = () => t.scrollWidth - window.innerWidth
      const horizontal = gsap.to(t, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: reducedMotion ? true : 0.8,
          invalidateOnRefresh: true,
        },
      })
      gsap.fromTo(
        '[data-j-progress]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true },
        },
      )
      if (reducedMotion) return

      // Chaque jour « s'allume » quand il traverse le centre de l'écran, et son illustration se dessine
      gsap.utils.toArray<HTMLElement>('[data-day]').forEach((day) => {
        const lit = {
          trigger: day,
          containerAnimation: horizontal,
          start: 'left 85%',
          end: 'left 35%',
          scrub: true,
        }
        gsap.fromTo(
          day.querySelectorAll('.day-art [pathLength]'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: 'none', stagger: 0.08, scrollTrigger: lit },
        )
        gsap.fromTo(day.querySelectorAll('.day-art .f'), { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', scrollTrigger: lit })
        gsap.fromTo(
          day.querySelector('[data-day-fill]'),
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: lit,
          },
        )
        gsap.fromTo(
          day,
          { rotate: 4, yPercent: 8 },
          {
            rotate: -2,
            yPercent: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: day,
              containerAnimation: horizontal,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section id="journey" ref={root} aria-labelledby="journey-title" className="relative z-10 h-[460vh] bg-ink">
      <div className="grain sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8">
          <p className="eyebrow text-ember">{journey.eyebrow}</p>
          <h2 id="journey-title" className="display mt-3 text-[clamp(2.2rem,6vw,5.4rem)] text-paper">
            {journey.title} <span className="serif-accent text-ember">{journey.titleAccent}</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-paper/65 md:text-base">{journey.text}</p>
        </div>

        <div className="mt-8 md:mt-12">
          <div ref={track} className="flex w-max gap-4 px-4 will-change-transform sm:px-8 md:gap-6">
            {days.map((day, i) => {
              const d = i + 1
              const last = d === days.length
              return (
                <div
                  key={d}
                  data-day
                  className={`relative flex h-[40svh] min-h-[250px] w-[64vw] flex-col justify-between overflow-hidden rounded-[22px] border p-5 sm:w-[36vw] md:h-[42svh] md:w-[23vw] md:p-7 ${
                    last ? 'border-ember/60 bg-ember/[0.06]' : 'border-paper/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ${
                        day.phase === 'Appliquer'
                          ? 'bg-ember/15 text-ember'
                          : day.phase === 'Préparer'
                            ? 'bg-teal/25 text-[#8cc3cf]'
                            : 'bg-paper/10 text-paper/70'
                      }`}
                    >
                      {day.phase}
                    </span>
                    <span className="flex gap-[3px]" aria-hidden="true">
                      {days.map((_, x) => (
                        <span key={x} className={`h-1.5 w-1 rounded-full ${x < d ? 'bg-ember' : 'bg-paper/15'}`} />
                      ))}
                    </span>
                  </div>
                  <div className="flex min-h-0 flex-1 items-center justify-center py-3">
                    <DayIllustration day={d} className="h-full max-h-[150px] w-auto max-w-[85%]" />
                  </div>
                  <div>
                    <div className="relative">
                      <span className="display text-stroke block text-[clamp(4.5rem,11vw,8.5rem)] leading-none">
                        {String(d).padStart(2, '0')}
                      </span>
                      <span
                        data-day-fill
                        aria-hidden="true"
                        className="display absolute inset-0 block text-[clamp(4.5rem,11vw,8.5rem)] leading-none text-ember"
                      >
                        {String(d).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="mt-3 text-base leading-snug font-bold text-paper md:text-lg">
                      <span className="sr-only">Jour {d} : </span>
                      {day.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1440px] px-4 sm:px-8 md:mt-12">
          <div className="h-px bg-paper/15">
            <div data-j-progress className="h-full origin-left bg-ember" />
          </div>
        </div>
      </div>
    </section>
  )
}
