import { site } from '../config'

type Props = { label: string; size?: 'md' | 'lg'; className?: string; withPrice?: boolean }

export function BuyButton({ label, size = 'md', className = '', withPrice = true }: Props) {
  const pad = size === 'lg' ? 'px-8 py-5 text-lg' : 'px-5 py-3 text-sm'
  return (
    <a href={site.buyUrl} className={`btn-ember ${pad} ${className}`}>
      <span>{label}</span>
      {withPrice && (
        <span className="rounded-full bg-ink/10 px-3 py-1 text-[0.9em] tabular-nums">{site.price}</span>
      )}
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
