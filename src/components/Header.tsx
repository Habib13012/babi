import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { site } from '../config'
import { shop } from '../lib/runtime'
import { scrollToTarget, setScrollLocked } from '../lib/smoothScroll'
import { Logo } from './Logo'

const isCurrent = (url: string) => {
  try {
    return new URL(url, window.location.href).pathname === window.location.pathname
  } catch {
    return false
  }
}

const cartCount = shop.cartCount ?? 0

export function Header() {
  const bar = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

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

  // Menu plein écran : verrouille le défilement, se ferme avec Échap
  useEffect(() => {
    if (!open) return
    const button = toggle.current
    setScrollLocked(true)
    panel.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
      button?.focus()
    }
  }, [open])

  useGSAP(
    () => {
      if (!open) return
      gsap.from('[data-menu-item]', { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' })
    },
    { dependencies: [open], scope: panel },
  )

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-ember" />
      </div>
      <header
        ref={header}
        className="group fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 [&.is-scrolled]:bg-ink/85 [&.is-scrolled]:backdrop-blur-xl"
      >
        {/* En-tête à 3 colonnes : logo centré, comme sur la page de paiement */}
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-8 md:h-20">
          <div className="flex items-center">
            <a
              href="/cart"
              className="flex items-center gap-2 text-sm font-semibold text-paper/85 transition-colors hover:text-paper md:hidden"
            >
              Panier
              {cartCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1.5 text-[11px] font-extrabold text-ink">
                  {cartCount}
                </span>
              )}
            </a>
            <nav aria-label="Navigation principale" className="hidden md:block">
              <ul className="flex items-center gap-7">
                {site.menu.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      aria-current={isCurrent(link.url) ? 'page' : undefined}
                      className="relative text-sm font-semibold text-paper/75 transition-colors hover:text-paper aria-[current=page]:text-paper after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-ember after:transition-transform after:duration-500 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()
                scrollToTarget('#hero')
              }
            }}
            aria-label={`${site.brand}, accueil`}
            className="justify-self-center"
          >
            <Logo />
          </a>

          <div className="flex items-center justify-end gap-6">
            <a
              href="/cart"
              className="hidden items-center gap-2 text-sm font-semibold text-paper/75 transition-colors hover:text-paper md:flex"
            >
              Panier
              {cartCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1.5 text-[11px] font-extrabold text-ink">
                  {cartCount}
                </span>
              )}
            </a>
            <a href={site.buyUrl} className="btn-ember hidden px-4 py-2.5 text-sm lg:inline-flex">
              Le guide <span className="tabular-nums">{site.price}</span>
            </a>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setOpen((v) => !v)}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-paper/15 bg-ink/40 backdrop-blur md:hidden"
            >
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[2px] w-5 rounded bg-paper transition-transform duration-500 ${open ? 'top-[5px] rotate-45' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-5 rounded bg-paper transition-transform duration-500 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <div
        id="menu-mobile"
        ref={panel}
        hidden={!open}
        className="grain fixed inset-0 z-[45] flex flex-col bg-navy px-6 pt-28 pb-[max(2rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <nav aria-label="Menu" className="flex-1">
          <ul className="flex flex-col gap-2">
            {site.menu.map((link, i) => (
              <li key={link.url} className="overflow-hidden">
                <a
                  data-menu-item
                  href={link.url}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(link.url) ? 'page' : undefined}
                  className="display flex items-baseline gap-4 py-2 text-[2.6rem] text-paper aria-[current=page]:text-ember"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-ember/80">{String(i + 1).padStart(2, '0')}</span>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-item>
          <a href={site.buyUrl} className="btn-ember w-full justify-between px-6 py-4 text-base">
            Obtenir le guide <span className="tabular-nums">{site.price}</span>
          </a>
          <p className="mt-5 text-center text-xs text-paper/45">{site.brand}</p>
        </div>
      </div>
    </>
  )
}
