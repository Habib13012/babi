import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { moment } from '../content'
import { media } from '../config'

type Props = { reducedMotion: boolean }

/**
 * Le « moment » : une séquence de phrases épinglée à l'écran.
 * Chaque phrase entre et sort au rythme du scroll, pendant que le livre recule dans l'ombre.
 */
export function Moment({ reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-moment-line]')
      if (reducedMotion) {
        gsap.set(lines, { autoAlpha: 0 })
        lines.forEach((line, i) => {
          gsap.to(line, {
            autoAlpha: 1,
            duration: 0.01,
            scrollTrigger: {
              trigger: root.current,
              start: () => `top+=${(i / lines.length) * (root.current!.offsetHeight - innerHeight)} top`,
              end: () => `top+=${((i + 1) / lines.length) * (root.current!.offsetHeight - innerHeight)} top`,
              toggleActions: 'play reverse play reverse',
            },
          })
        })
        return
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      lines.forEach((line, i) => {
        const at = i * 1.2
        tl.fromTo(
          line,
          { autoAlpha: 0, y: 60, filter: 'blur(12px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6 },
          at,
        )
        if (i < lines.length - 1) {
          tl.to(line, { autoAlpha: 0, y: -60, filter: 'blur(12px)', duration: 0.5, ease: 'power2.in' }, at + 0.85)
        }
      })
      // La tablette apparaît en fond sur la 2e phrase, puis disparaît
      tl.fromTo(
        '[data-moment-tablet]',
        { autoAlpha: 0, clipPath: 'inset(50% 50% 50% 50% round 20px)', scale: 1.15 },
        { autoAlpha: 0.5, clipPath: 'inset(0% 0% 0% 0% round 20px)', scale: 1, duration: 0.8 },
        1.1,
      ).to('[data-moment-tablet]', { autoAlpha: 0, y: -80, duration: 0.6 }, 2.2)

      tl.fromTo('[data-moment-progress]', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0)
      tl.to({}, { duration: 0.4 })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section id="moment" ref={root} aria-label="Le moment de l'écran" className="relative h-[420vh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(6,14,24,0.85)_75%)]"
        />
        <img
          data-moment-tablet
          src={media.detailTablette}
          alt=""
          loading="lazy"
          width={450}
          height={255}
          className="invisible absolute top-[14%] right-[6%] w-[min(380px,60vw)] rounded-[20px] object-cover grayscale-[30%]"
        />
        <p className="sr-only">{moment.map((l) => `${l.kicker} ${l.text}`).join(' ')}</p>
        <div
          aria-hidden="true"
          className="relative mx-auto grid w-full max-w-[1440px] place-items-center px-4 text-center sm:px-8"
        >
          {moment.map((line, i) => (
            <div key={i} data-moment-line className="col-start-1 row-start-1 w-full max-w-[1100px]">
              <p className="mb-5 text-sm font-semibold tracking-wide text-mist md:text-base">{line.kicker}</p>
              <p
                className={`display text-[clamp(2.4rem,7vw,6.4rem)] ${
                  i === moment.length - 1 ? 'serif-accent text-ember' : 'text-paper'
                }`}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute top-1/2 right-4 h-28 w-px -translate-y-1/2 bg-paper/15 sm:right-8">
          <div data-moment-progress className="h-full origin-top bg-ember" />
        </div>
      </div>
    </section>
  )
}
