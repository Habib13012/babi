import { useRef } from 'react'
import { interaction } from '../three/choreography'

type Props = { className?: string; hint?: boolean }

/**
 * Zone invisible posée sur le livre : glisser (souris ou doigt) pour le faire pivoter,
 * ou flèches gauche/droite au clavier. Le défilement vertical reste libre sur mobile.
 */
export function DragZone({ className = '', hint = true }: Props) {
  const last = useRef<number | null>(null)

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Aperçu 3D du guide. Glissez, ou utilisez les flèches gauche et droite, pour le faire pivoter."
      className={`pointer-events-auto absolute cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
      onPointerDown={(e) => {
        last.current = e.clientX
        interaction.dragging = true
        interaction.dragVelocity = 0
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (last.current === null) return
        const dx = e.clientX - last.current
        last.current = e.clientX
        interaction.dragY += dx * 0.012
        interaction.dragVelocity = dx * 0.012
      }}
      onPointerUp={() => {
        last.current = null
        interaction.dragging = false
      }}
      onPointerCancel={() => {
        last.current = null
        interaction.dragging = false
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault()
          interaction.dragVelocity += e.key === 'ArrowLeft' ? -0.06 : 0.06
        }
      }}
    >
      {hint && (
        <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-paper/15 bg-ink/40 px-3 py-1.5 text-[11px] font-semibold tracking-wide whitespace-nowrap text-paper/70 backdrop-blur-md">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Glissez pour faire pivoter
        </span>
      )}
    </div>
  )
}
