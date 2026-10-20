/**
 * Chorégraphie du livre 3D, pilotée par la position de défilement.
 *
 * Chaque image-clé est ancrée à une section (id DOM) et à une progression 0→1
 * dans sa zone « sticky ». La pose cible est interpolée entre les images-clés,
 * ce qui rend l'animation totalement réversible et synchronisée au scroll.
 */

export type Pose = {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  s: number
  /** 0 = fermé, 1 = couverture ouverte */
  open: number
}

type Keyframe = {
  section: string
  /** progression dans la zone sticky de la section (0 → 1) */
  p: number
  /** décalage additionnel en hauteurs d'écran */
  offsetVh?: number
  /** saut instantané (utilisé quand le livre est hors champ) */
  cut?: boolean
  desktop: Pose
  mobile: Pose
}

const TAU = Math.PI * 2

const pose = (p: Partial<Pose>): Pose => ({
  x: 0,
  y: 0,
  z: 0,
  rx: 0.06,
  ry: 0.42,
  rz: 0,
  s: 1,
  open: 0,
  ...p,
})

const HIDDEN_TOP = pose({ y: 7, rx: -0.9, ry: 0.9, s: 0.9 })
const HIDDEN_BOTTOM = pose({ y: -7, rx: 0.6, ry: -0.6, s: 0.9 })

const KEYFRAMES: Keyframe[] = [
  {
    section: 'hero',
    p: 0,
    desktop: pose({ x: 1.85, y: -0.05, ry: 0.5, rz: -0.03 }),
    mobile: pose({ x: 0, y: -1.15, s: 0.56, ry: 0.42 }),
  },
  {
    section: 'moment',
    p: 0,
    desktop: pose({ x: 0, y: -4.2, z: -16, ry: 2.2, rx: 0.25, rz: 0.15 }),
    mobile: pose({ x: 0, y: -5.4, z: -16, ry: 2.2, rx: 0.25, s: 0.7 }),
  },
  {
    section: 'moment',
    p: 1,
    desktop: pose({ x: 0, y: -2.9, z: -9, ry: 3.6, rx: 0.1, rz: -0.08 }),
    mobile: pose({ x: 0, y: -3.2, z: -9, ry: 3.6, rx: 0.1, s: 0.7 }),
  },
  {
    section: 'discover',
    p: 0.08,
    desktop: pose({ x: 1.3, y: -0.05, ry: TAU + 0.38 }),
    mobile: pose({ x: 0, y: -0.75, s: 0.6, ry: TAU + 0.38 }),
  },
  {
    section: 'discover',
    p: 0.18,
    desktop: pose({ x: 1.3, y: -0.05, ry: TAU + 0.38 }),
    mobile: pose({ x: 0, y: -0.75, s: 0.6, ry: TAU + 0.38 }),
  },
  {
    // tour complet : dos, tranche, puis retour face
    section: 'discover',
    p: 0.56,
    desktop: pose({ x: 1.3, y: 0, rx: 0.12, ry: 2 * TAU + 0.38 }),
    mobile: pose({ x: 0, y: -0.7, s: 0.6, rx: 0.12, ry: 2 * TAU + 0.38 }),
  },
  {
    section: 'discover',
    p: 0.64,
    desktop: pose({ x: 1.3, y: 0, ry: 2 * TAU + 0.1 }),
    mobile: pose({ x: 0, y: -0.7, s: 0.6, ry: 2 * TAU + 0.1 }),
  },
  {
    section: 'discover',
    p: 0.9,
    desktop: pose({ x: 1.95, y: -0.05, rx: 0.2, ry: 2 * TAU - 0.12, s: 0.95, open: 1 }),
    mobile: pose({ x: 0.5, y: -0.85, s: 0.5, rx: 0.2, ry: 2 * TAU - 0.1, open: 1 }),
  },
  {
    section: 'discover',
    p: 1,
    desktop: pose({ x: 1.95, y: -0.05, rx: 0.2, ry: 2 * TAU - 0.12, s: 0.95, open: 1 }),
    mobile: pose({ x: 0.5, y: -0.85, s: 0.5, rx: 0.2, ry: 2 * TAU - 0.1, open: 1 }),
  },
  {
    section: 'pillars',
    p: 0,
    offsetVh: -0.25,
    desktop: { ...HIDDEN_TOP, ry: 2 * TAU + 0.9 },
    mobile: { ...HIDDEN_TOP, ry: 2 * TAU + 0.9, s: 0.6 },
  },
  {
    section: 'finale',
    p: 0,
    offsetVh: -0.6,
    desktop: { ...HIDDEN_TOP, ry: 2 * TAU + 0.9 },
    mobile: { ...HIDDEN_TOP, ry: 2 * TAU + 0.9, s: 0.6 },
  },
  {
    section: 'finale',
    p: 0,
    offsetVh: -0.6,
    cut: true,
    desktop: { ...HIDDEN_BOTTOM, ry: 2 * TAU - 1.4 },
    // sur mobile, le texte occupe le bas de l'écran : le livre arrive par le haut
    mobile: { ...HIDDEN_TOP, ry: 2 * TAU - 1.4, s: 0.5 },
  },
  {
    section: 'finale',
    p: 0,
    desktop: pose({ x: 1.8, y: -0.1, ry: 2 * TAU + 0.45, rz: 0.03 }),
    mobile: pose({ x: 0, y: 1.0, s: 0.36, ry: 2 * TAU + 0.42 }),
  },
  {
    // le livre accompagne la page quand le pied de page apparaît
    section: 'finale',
    p: 0,
    offsetVh: 0.2,
    desktop: pose({ x: 1.8, y: 0.85, ry: 2 * TAU + 0.6, rz: 0.03 }),
    mobile: pose({ x: 0, y: 1.88, s: 0.36, ry: 2 * TAU + 0.55 }),
  },
]

type Resolved = { at: number; cut: boolean; pose: Pose }
let resolved: Resolved[] = []
let resolvedMobile = false

/** Recalcule les positions de scroll des images-clés (au chargement et au redimensionnement). */
export function measureChoreography() {
  const vh = window.innerHeight
  const scrollY = window.scrollY
  resolvedMobile = window.innerWidth < 768
  const next: Resolved[] = []
  for (const k of KEYFRAMES) {
    const el = document.getElementById(k.section)
    if (!el) continue
    const top = el.getBoundingClientRect().top + scrollY
    const range = Math.max(0, el.offsetHeight - vh)
    next.push({
      at: top + range * k.p + (k.offsetVh ?? 0) * vh,
      cut: Boolean(k.cut),
      pose: resolvedMobile ? k.mobile : k.desktop,
    })
  }
  resolved = next
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const KEYS = ['x', 'y', 'z', 'rx', 'ry', 'rz', 's', 'open'] as const

export function targetPose(scrollY: number, out: Pose): Pose {
  if (resolved.length === 0) return Object.assign(out, KEYFRAMES[0].desktop)
  if (scrollY <= resolved[0].at) return Object.assign(out, resolved[0].pose)
  for (let i = 0; i < resolved.length - 1; i++) {
    const a = resolved[i]
    const b = resolved[i + 1]
    if (scrollY >= a.at && scrollY < b.at) {
      if (b.cut) return Object.assign(out, a.pose)
      const t = smooth((scrollY - a.at) / Math.max(1, b.at - a.at))
      for (const key of KEYS) out[key] = a.pose[key] + (b.pose[key] - a.pose[key]) * t
      return out
    }
  }
  return Object.assign(out, resolved[resolved.length - 1].pose)
}

export const isOffstage = (p: Pose) => Math.abs(p.y) > 6.2

/** État partagé entre le DOM (pointeur, glisser) et la scène 3D. */
export const interaction = {
  pointerX: 0,
  pointerY: 0,
  dragY: 0,
  dragging: false,
  dragVelocity: 0,
}
