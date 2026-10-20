import { site } from '../config'
import { DiscountBadge, Price } from './Price'

type Variant = 'download' | 'gift' | 'hero'
type Props = { label: string; variant?: Variant; sublabel?: string; className?: string }

function DownloadIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" className="buy-icon-bounce">
      <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function GiftIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="9" width="17" height="11.5" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 13h17M12 9v11.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9Zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Boutons d'achat, déclinés par emplacement pour ne pas répéter le même bouton :
 * - download : orange, icône de téléchargement et reflet lumineux (ouverture)
 * - gift     : clair, icône cadeau (fin du feuilletage)
 * - hero     : grand bouton sur deux lignes avec halo pulsé (final)
 */
export function BuyButton({ label, variant = 'download', sublabel, className = '' }: Props) {
  if (variant === 'gift') {
    return (
      <a
        href={site.buyUrl}
        className={`group inline-flex items-center gap-3 rounded-full bg-paper px-5 py-3 text-sm font-bold text-navy shadow-[0_12px_30px_-12px_rgba(244,242,236,0.45)] transition-transform duration-500 hover:-translate-y-0.5 ${className}`}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ember/15 text-ember transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
          <GiftIcon />
        </span>
        <span>{label}</span>
        <Price className="font-extrabold text-navy" oldClassName="text-navy/45" />
      </a>
    )
  }

  if (variant === 'hero') {
    return (
      <a
        href={site.buyUrl}
        className={`buy-pulse btn-ember group w-full max-w-[460px] justify-between px-6 py-4 sm:w-auto sm:px-7 sm:py-5 ${className}`}
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-ember">
          <DownloadIcon />
        </span>
        <span className="flex flex-1 flex-col text-left leading-tight">
          <span className="text-base sm:text-lg">{label}</span>
          {sublabel && <span className="mt-0.5 text-xs font-semibold text-ink/65">{sublabel}</span>}
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1 leading-none">
          {site.comparePrice && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-ink/60">
              <s aria-hidden="true" className="decoration-2">{site.comparePrice}</s>
              <DiscountBadge className="bg-ink" />
            </span>
          )}
          <span className="text-xl font-extrabold tabular-nums whitespace-nowrap">{site.price}</span>
          {site.comparePrice && <span className="sr-only">au lieu de {site.comparePrice}</span>}
        </span>
      </a>
    )
  }

  return (
    <a href={site.buyUrl} className={`btn-ember buy-shine group overflow-hidden px-5 py-3 text-sm ${className}`}>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-ember">
        <DownloadIcon />
      </span>
      <span>{label}</span>
      <Price className="rounded-full bg-ink/10 px-3 py-1 text-[0.9em]" oldClassName="text-ink/55" />
    </a>
  )
}
