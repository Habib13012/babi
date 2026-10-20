import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { gallery, pagesPreview } from '../content'

type Props = { reducedMotion: boolean }

// Trois colonnes qui défilent à des vitesses différentes (profondeur), décalages en px
const COLUMNS = [
  { pages: [0, 3], from: 40, to: -40 },
  { pages: [1, 4], from: 140, to: -140 },
  { pages: [2, 5], from: 0, to: -90 },
]

export function Gallery({ reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.utils.toArray<HTMLElement>('[data-g-col]').forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: COLUMNS[i].from },
          {
            y: COLUMNS[i].to,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-g-page]').forEach((page, i) => {
        gsap.fromTo(
          page,
          { clipPath: 'inset(100% 0% 0% 0% round 6px)', rotate: i % 2 ? 3 : -3 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 6px)',
            rotate: 0,
            ease: 'none',
            scrollTrigger: { trigger: page, start: 'top 98%', end: 'top 55%', scrub: 0.6 },
          },
        )
      })
      gsap.from('[data-g-head] > *', {
        autoAlpha: 0,
        y: 50,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: '[data-g-head]', start: 'top 90%', end: 'top 55%', scrub: 0.6 },
      })
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  return (
    <section
      id="gallery"
      ref={root}
      aria-labelledby="gallery-title"
      className="relative z-10 overflow-hidden rounded-t-[32px] bg-paper text-navy md:rounded-t-[56px]"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pt-24 pb-28 sm:px-8 md:grid-cols-12 md:gap-10 md:pt-36 md:pb-44">
        <div data-g-head className="md:col-span-4 md:pt-10">
          <p className="eyebrow text-teal">{gallery.eyebrow}</p>
          <h2 id="gallery-title" className="display mt-5 text-[clamp(2.3rem,4.6vw,4.2rem)]">
            {gallery.title}
          </h2>
          <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-navy/65 md:text-lg">{gallery.text}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:col-span-8 md:grid-cols-3 md:gap-6">
          {COLUMNS.map((col, ci) => (
            <div
              key={ci}
              data-g-col
              className={`flex flex-col gap-3 sm:gap-5 md:gap-6 ${ci === 2 ? 'col-span-2 grid grid-cols-2 md:col-span-1 md:flex' : ''}`}
            >
              {col.pages.map((pi) => {
                const page = pagesPreview[pi]
                return (
                  <figure
                    key={page.src}
                    data-g-page
                    className="overflow-hidden rounded-[6px] bg-white shadow-[0_24px_50px_-24px_rgba(18,40,62,0.45)] ring-1 ring-navy/10"
                  >
                    <img
                      src={page.src}
                      alt={page.alt}
                      loading="lazy"
                      decoding="async"
                      width={900}
                      height={1273}
                      className="w-full"
                    />
                  </figure>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
