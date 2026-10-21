import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { media } from '../config'
import { BuyButton } from '../components/BuyButton'
import { DragZone } from '../components/DragZone'
import { scrollToTarget } from '../lib/smoothScroll'
import { Stars } from '../components/Stars'
import { average, averageLabel } from '../lib/reviewStats'
import { hero } from '../content'

type Props = { introDone: boolean; use3D: boolean; reducedMotion: boolean }

export function Hero({ introDone, use3D, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.set('[data-intro]', { autoAlpha: 0, y: 30 })
      gsap.set('[data-hero-title]', { autoAlpha: 0 })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  useGSAP(
    () => {
      if (!introDone || reducedMotion) return
      const split = SplitText.create('[data-hero-title] [data-line]', {
        type: 'words,chars',
        wordsClass: 'inline-block whitespace-nowrap',
        charsClass: 'inline-block will-change-transform',
      })
      gsap.set('[data-hero-title]', { autoAlpha: 1 })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(split.chars, { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.028 })
        .to('[data-intro]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.09 }, 0.35)
        .from('[data-hero-glow]', { scale: 0.6, autoAlpha: 0, duration: 2.2, ease: 'power2.out' }, 0)

      // Sortie au scroll : le titre file vers le haut pendant que le livre recule
      gsap.to('[data-hero-content]', {
        yPercent: -28,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 20%', scrub: true },
      })
      gsap.to('[data-hero-bgword]', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => split.revert()
    },
    { scope: root, dependencies: [introDone, reducedMotion] },
  )

  return (
    <section
      id="hero"
      ref={root}
      aria-labelledby="hero-title"
      className="grain relative isolate flex h-svh min-h-[620px] overflow-hidden"
    >
      {/* Lumière d'ambiance derrière le livre */}
      <div
        data-hero-glow
        aria-hidden="true"
        className="absolute top-[58%] left-1/2 -z-10 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,132,60,0.28),rgba(27,58,87,0.35)_45%,transparent_70%)] blur-2xl md:top-1/2 md:left-[72%]"
      />
      <p
        data-hero-bgword
        aria-hidden="true"
        className="display text-stroke pointer-events-none absolute bottom-[-0.12em] left-0 -z-10 text-[34vw] whitespace-nowrap select-none"
      >
        14 jours · 14 jours
      </p>

      <div
        data-hero-content
        className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pt-24 sm:px-8 md:justify-center md:pt-0"
      >
        <div className="max-w-[780px]">
          <a
            data-intro
            href="#reviews"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#reviews')
            }}
            aria-label={`Note ${averageLabel} sur 5, plus de 100 parents heureux : voir les avis`}
            className="group mb-4 inline-flex items-center gap-2.5 rounded-full border border-paper/15 bg-paper/[0.06] py-1.5 pr-3.5 pl-2.5 text-xs font-semibold text-paper/80 transition-colors hover:border-ember/60 hover:text-paper"
          >
            <Stars rating={average} />
            <span className="font-extrabold text-paper tabular-nums">{averageLabel}</span>
            <span className="underline decoration-ember/60 underline-offset-4 group-hover:decoration-ember">
              + de 100 parents heureux
            </span>
          </a>
          <p data-intro className="eyebrow text-ember">
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" data-hero-title className="display mt-4 text-[clamp(3rem,8.4vw,7.6rem)]">
            <span data-line className="split-line block text-paper">
              {hero.titleTop}
            </span>
            <span data-line className="split-line block text-ember">
              {hero.titleBottom}
            </span>
          </h1>
          <p
            data-intro
            className="mt-5 max-w-[30rem] text-[15px] leading-relaxed text-paper/75 sm:text-lg md:mt-7"
          >
            {hero.lead}
          </p>
          <div data-intro className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-9">
            <BuyButton label="Télécharger le guide" variant="download" />
            <a
              href="#discover"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#discover')
              }}
              className="text-sm font-semibold text-paper/80 underline decoration-ember decoration-2 underline-offset-8 transition-colors hover:text-paper"
            >
              Découvrir le guide
            </a>
          </div>
        </div>
      </div>

      {use3D ? (
        <DragZone className="right-0 bottom-0 h-[38%] w-full md:top-[14%] md:right-[4%] md:h-[72%] md:w-[38%]" />
      ) : (
        <img
          src={media.mockup}
          fetchPriority="high"
          alt="Le guide « Mon enfant et les écrans » de Habib Tahrat"
          width={715}
          height={803}
          className="pointer-events-none absolute bottom-[3%] left-1/2 h-[36%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)] md:top-1/2 md:bottom-auto md:left-[72%] md:h-[72%] md:-translate-y-1/2"
        />
      )}

      <div
        data-intro
        aria-hidden="true"
        className="absolute bottom-6 left-4 hidden items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-paper/50 uppercase sm:left-8 md:flex"
      >
        <span className="relative h-10 w-px overflow-hidden bg-paper/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-ember" />
        </span>
        Faites défiler
        <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
      </div>
    </section>
  )
}
