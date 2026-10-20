import { site } from '../config'

type Props = { className?: string; oldClassName?: string }

/** Prix actuel précédé de l'ancien prix barré (si une réduction est définie dans Shopify). */
export function Price({ className = '', oldClassName = 'opacity-55' }: Props) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 whitespace-nowrap tabular-nums ${className}`}>
      {site.comparePrice && (
        <s aria-hidden="true" className={`text-[0.8em] font-semibold decoration-2 ${oldClassName}`}>
          {site.comparePrice}
        </s>
      )}
      <span>{site.price}</span>
      {site.comparePrice && <span className="sr-only">au lieu de {site.comparePrice}</span>}
    </span>
  )
}

/** Pastille « -45 % ». */
export function DiscountBadge({ className = 'bg-paper' }: { className?: string }) {
  if (!site.comparePrice || !site.discount) return null
  return (
    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-extrabold text-ember tabular-nums ${className}`}>
      -{site.discount} %
    </span>
  )
}
