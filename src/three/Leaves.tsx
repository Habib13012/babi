import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Pose } from './choreography'
import { LEAVES } from './reading'

const SEG = 28 // subdivisions sur la largeur, pour courber la page
// Angle d'une feuille tournée : légèrement décroissant pour que la dernière tournée
// repose au-dessus des précédentes (et toutes au-dessus de la couverture, à 0,985 π)
const turnedAngle = (i: number) => Math.PI * (0.975 - 0.004 * i)
const GAP = 0.0035 // écart entre deux feuilles empilées

type Props = {
  pose: RefObject<Pose | null>
  /** 2 × LEAVES textures : recto et verso de chaque feuille */
  pages: THREE.Texture[]
  width: number
  height: number
  /** position de la charnière (bord intérieur) et du haut du bloc de pages */
  hingeX: number
  baseZ: number
}

/**
 * Feuilles qui tournent : chaque feuille est un plan subdivisé dont les sommets sont
 * recalculés le long d'un arc, ce qui donne la courbure d'une vraie page qui tourne.
 */
export function Leaves({ pose, pages, width, height, hingeX, baseZ }: Props) {
  const leaves = useMemo(
    () =>
      Array.from({ length: LEAVES }, (_, i) => {
        const geometry = new THREE.PlaneGeometry(width, height, SEG, 1)
        geometry.translate(width / 2, 0, 0)
        const front = pages[i * 2]
        const back = pages[i * 2 + 1]
        // le verso est vu « de dos » : on retourne la texture horizontalement
        back.repeat.set(-1, 1)
        back.offset.set(1, 0)
        const frontMat = new THREE.MeshStandardMaterial({ map: front, roughness: 0.9, side: THREE.FrontSide })
        const backMat = new THREE.MeshStandardMaterial({ map: back, roughness: 0.9, side: THREE.BackSide })
        return { geometry, frontMat, backMat, last: { angle: NaN, bend: NaN } }
      }),
    [pages, width, height],
  )

  useEffect(
    () => () => {
      for (const l of leaves) {
        l.geometry.dispose()
        l.frontMat.dispose()
        l.backMat.dispose()
      }
    },
    [leaves],
  )

  const groups = useRef<(THREE.Group | null)[]>([])

  useFrame(() => {
    const cur = pose.current
    if (!cur) return
    leaves.forEach((leaf, i) => {
      const turn = THREE.MathUtils.clamp(cur.flip - i, 0, 1)
      const open = THREE.MathUtils.clamp(cur.open, 0, 1)
      const angle = turn * turnedAngle(i) * open
      const bend = Math.sin(Math.PI * turn) * 0.8 * open
      if (Math.abs(angle - leaf.last.angle) < 1e-4 && Math.abs(bend - leaf.last.bend) < 1e-4) return
      leaf.last.angle = angle
      leaf.last.bend = bend
      bendLeaf(leaf.geometry, width, angle, bend)
      // la feuille en mouvement passe au-dessus des autres
      const g = groups.current[i]
      if (g) g.renderOrder = turn > 0 && turn < 1 ? 2 : 1
    })
  })

  return (
    <>
      {leaves.map((leaf, i) => (
        <group
          key={i}
          ref={(el) => {
            groups.current[i] = el
          }}
          position={[hingeX, 0, baseZ + (LEAVES - i) * GAP]}
        >
          <mesh geometry={leaf.geometry} material={leaf.frontMat} />
          <mesh geometry={leaf.geometry} material={leaf.backMat} />
        </group>
      ))}
    </>
  )
}

/** Place les sommets le long d'un arc : l'angle augmente vers la charnière, le bord libre suit avec retard. */
function bendLeaf(geometry: THREE.PlaneGeometry, width: number, angle: number, bend: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const step = width / SEG
  const xs = new Float32Array(SEG + 1)
  const zs = new Float32Array(SEG + 1)
  for (let j = 1; j <= SEG; j++) {
    const mid = (j - 0.5) / SEG
    const a = angle - bend * Math.pow(mid, 1.6)
    xs[j] = xs[j - 1] + Math.cos(a) * step
    zs[j] = zs[j - 1] + Math.sin(a) * step
  }
  const cols = SEG + 1
  for (let v = 0; v < pos.count; v++) {
    const j = v % cols
    pos.setX(v, xs[j])
    pos.setZ(v, zs[j])
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
}
