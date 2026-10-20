const STAR = 'M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z'

/** Étoiles avec remplissage partiel (4,6 → 4 pleines et une à 60 %). */
export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i))
        return (
          <span key={i} className="relative h-4 w-4">
            <svg viewBox="0 0 20 20" className="absolute inset-0 h-4 w-4 text-paper/20">
              <path fill="currentColor" d={STAR} />
            </svg>
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-ember">
                <path fill="currentColor" d={STAR} />
              </svg>
            </span>
          </span>
        )
      })}
    </span>
  )
}
