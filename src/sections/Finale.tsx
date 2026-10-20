import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { finale } from '../content'
import { media, site } from '../config'
import { BuyButton } from '../components/BuyButton'
import { DragZone } from '../components/DragZone'
import { scrollToTarget } from '../lib/smoothScroll'

type Props = { use3D: boolean; reducedMotion: boolean }

const YEAR = new Date().getFullYear()

export function Finale({ use3D, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      const split = SplitText.create('[data-f-title]', { type: 'lines,words', linesClass: 'split-line', mask: 'lines' })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 10%', scrub: 0.6 },
      })
      tl.from(split.words, { yPercent: 110, stagger: 0.06, ease: 'none' })
        .from('[data-f-fade]', { autoAlpha: 0, y: 40, stagger: 0.1, ease: 'none' }, 0.3)
        .from('[data-f-glow]', { scale: 0.4, autoAlpha: 0, ease: 'none' }, 0)
      return () => split.revert()
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <>
      <section
        id="finale"
        ref={root}
        aria-labelledby="finale-title"
        className="relative isolate flex min-h-svh items-end overflow-hidden pb-28 md:items-center md:pb-0"
      >
        <div
          data-f-glow
          aria-hidden="true"
          className="absolute top-[30%] left-1/2 -z-10 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,132,60,0.32),rgba(27,58,87,0.3)_45%,transparent_70%)] blur-2xl md:top-1/2 md:left-[70%]"
        />
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8">
          <div className="max-w-[640px]">
            <p data-f-fade className="eyebrow text-ember">
              {finale.eyebrow}
            </p>
            <h2 id="finale-title" data-f-title className="display mt-4 text-[clamp(2.8rem,8vw,7.4rem)] text-paper">
              {finale.title} <span className="serif-accent text-ember">{finale.titleAccent}</span>
            </h2>
            <p data-f-fade className="mt-6 max-w-[34ch] text-base text-paper/75 md:text-lg">
              {finale.text}
            </p>
            <div data-f-fade className="mt-8 flex flex-wrap items-center gap-4">
              <BuyButton label={finale.cta} size="lg" />
            </div>
          </div>
        </div>

        {use3D ? (
          <DragZone className="top-[12%] left-0 h-[30%] w-full md:top-[12%] md:right-[4%] md:left-auto md:h-[76%] md:w-[40%]" />
        ) : (
          <img
            src={media.mockup}
            alt=""
            loading="lazy"
            width={715}
            height={803}
            className="pointer-events-none absolute top-[7%] left-1/2 h-[28%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] md:top-1/2 md:left-[70%] md:h-[72%] md:-translate-y-1/2"
          />
        )}
      </section>

      <footer className="relative border-t border-paper/10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {YEAR} {site.brand} · {site.title} par {site.author}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {site.links.map((link) => (
              <a key={link.url} href={link.url} className="transition-colors hover:text-paper">
                {link.title}
              </a>
            ))}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#hero')
              }}
              className="transition-colors hover:text-paper"
            >
              Retour en haut ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
