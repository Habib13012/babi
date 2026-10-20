import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { site } from '../config'
import { scrollToTarget } from '../lib/smoothScroll'

export function Header() {
  const bar = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Barre de progression de lecture
    gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
    // Le header passe en mode « verre » après l'ouverture
    ScrollTrigger.create({
      start: () => window.innerHeight * 0.6,
      end: 'max',
      toggleClass: { targets: header.current, className: 'is-scrolled' },
    })
  })

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-ember" />
      </div>
      <header
        ref={header}
        className="group fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 [&.is-scrolled]:bg-ink/85 [&.is-scrolled]:backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8 md:h-20">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#hero')
            }}
            className="flex items-center gap-3 text-sm font-extrabold tracking-tight text-paper"
          >
            <span aria-hidden="true" className="grid h-8 w-6 place-items-end rounded-[3px] bg-paper pb-1.5 shadow-[3px_3px_0_var(--color-navy-2)]">
              <span className="mx-auto block h-[2px] w-3 bg-ember" />
            </span>
            <span>{site.title}</span>
          </a>
          <nav aria-label="Navigation principale" className="flex items-center gap-6">
            <a
              href="#included"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#included')
              }}
              className="hidden text-sm font-semibold text-paper/75 transition-colors hover:text-paper md:inline"
            >
              Ce que vous recevez
            </a>
            <a href={site.buyUrl} className="btn-ember hidden px-4 py-2.5 text-sm sm:inline-flex">
              Le guide <span className="tabular-nums">{site.price}</span>
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}
