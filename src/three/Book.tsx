import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { media } from '../config'
import { interaction, isOffstage, targetPose, type Pose } from './choreography'
import { Leaves } from './Leaves'
import { LEAVES } from './reading'
import {
  backTexture,
  innerCoverTexture,
  pageEdgeTexture,
  spineTexture,
} from './textures'

// Proportions d'un format A4 (1 : 1,414)
const W = 2
const H = 2.83
const D = 0.2
const C = 0.022 // épaisseur de la couverture
const PAGE_GAP = 0.024 // espace pour les feuilles mobiles

const TEXTURE_URLS = [media.coverFront, ...media.reading]

type Props = { reducedMotion: boolean; onReady: () => void }

export function Book({ reducedMotion, onReady }: Props) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const hinge = useRef<THREE.Group>(null)
  const gl = useThree((s) => s.gl)

  const textures = useTexture(TEXTURE_URLS, (loaded) => {
    for (const t of Array.isArray(loaded) ? loaded : [loaded]) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = gl.capabilities.getMaxAnisotropy()
    }
  })
  const cover = textures[0]
  const pages = useMemo(() => textures.slice(1), [textures])
  const leafPages = useMemo(() => pages.slice(0, LEAVES * 2), [pages])
  const tex = useMemo(() => {
    const spine = spineTexture()
    spine.center.set(0.5, 0.5)
    spine.rotation = Math.PI / 2
    const edgeTop = pageEdgeTexture(false)
    return {
      spine,
      back: backTexture(),
      inner: innerCoverTexture(),
      edgeSide: pageEdgeTexture(true),
      edgeTop,
    }
  }, [])

  const mats = useMemo(() => {
    const navy = new THREE.MeshPhysicalMaterial({
      color: '#12283e',
      roughness: 0.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
    })
    const coverMat = new THREE.MeshPhysicalMaterial({
      map: cover,
      roughness: 0.42,
      clearcoat: 0.65,
      clearcoatRoughness: 0.22,
    })
    const backMat = new THREE.MeshPhysicalMaterial({
      map: tex.back,
      roughness: 0.45,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
    })
    const spineMat = new THREE.MeshPhysicalMaterial({
      map: tex.spine,
      roughness: 0.45,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
    })
    const inner = new THREE.MeshStandardMaterial({ map: tex.inner, roughness: 0.8 })
    const paper = new THREE.MeshStandardMaterial({ color: '#f1ece0', roughness: 0.92 })
    // dernière page, visible sous toutes les feuilles tournées
    const titlePage = new THREE.MeshStandardMaterial({ map: pages[LEAVES * 2], roughness: 0.9 })
    const edgeSide = new THREE.MeshStandardMaterial({ map: tex.edgeSide, roughness: 0.95 })
    const edgeTop = new THREE.MeshStandardMaterial({ map: tex.edgeTop, roughness: 0.95 })
    return { navy, coverMat, backMat, spineMat, inner, paper, titlePage, edgeSide, edgeTop }
  }, [cover, pages, tex])

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose())
      Object.values(tex).forEach((t) => t.dispose())
    },
    [mats, tex],
  )

  // Ordre des faces d'un BoxGeometry : +x, -x, +y, -y, +z, -z
  const pagesMaterials = useMemo(
    () => [mats.edgeSide, mats.paper, mats.edgeTop, mats.edgeTop, mats.titlePage, mats.paper],
    [mats],
  )
  const frontMaterials = useMemo(
    () => [mats.navy, mats.navy, mats.navy, mats.navy, mats.coverMat, mats.inner],
    [mats],
  )
  const backMaterials = useMemo(
    () => [mats.navy, mats.navy, mats.navy, mats.navy, mats.inner, mats.backMat],
    [mats],
  )
  const spineMaterials = useMemo(
    () => [mats.navy, mats.spineMat, mats.navy, mats.navy, mats.navy, mats.navy],
    [mats],
  )

  const current = useRef<Pose | null>(null)
  const target = useMemo<Pose>(() => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, open: 0, flip: 0 }), [])
  const notified = useRef(false)

  useFrame((state, delta) => {
    const g = root.current
    const b = body.current
    const h = hinge.current
    if (!g || !b || !h) return

    targetPose(window.scrollY, target)
    if (!current.current) current.current = { ...target }
    const cur = current.current
    const k = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 5.5)
    for (const key of Object.keys(target) as (keyof Pose)[]) {
      cur[key] += (target[key] - cur[key]) * k
    }

    // Retour progressif après un glisser, avec inertie
    if (!interaction.dragging) {
      interaction.dragY += interaction.dragVelocity
      interaction.dragVelocity *= 0.92
      interaction.dragY *= reducedMotion ? 0 : 0.965
    }

    const t = state.clock.elapsedTime
    const float = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.045
    const px = reducedMotion ? 0 : interaction.pointerX
    const py = reducedMotion ? 0 : interaction.pointerY

    g.position.set(cur.x, cur.y + float, cur.z)
    g.scale.setScalar(cur.s)
    b.rotation.set(cur.rx - py * 0.12, cur.ry + px * 0.22 + interaction.dragY, cur.rz)
    h.rotation.y = -THREE.MathUtils.clamp(cur.open, 0, 1) * Math.PI * 0.985
    g.visible = !isOffstage(cur)

    if (!notified.current) {
      notified.current = true
      onReady()
    }
  })

  return (
    <group ref={root}>
      <group ref={body}>
        {/* Bloc de pages (abaissé pour laisser la place aux feuilles qui tournent) */}
        <mesh position={[0.012, 0, -PAGE_GAP / 2]} material={pagesMaterials} castShadow>
          <boxGeometry args={[W - 0.05, H - 0.06, D - C * 2 - PAGE_GAP]} />
        </mesh>
        <Leaves
          pose={current}
          pages={leafPages}
          width={W - C - 0.04}
          height={H - 0.07}
          hingeX={-W / 2 + C}
          baseZ={D / 2 - C - PAGE_GAP + 0.001}
        />
        {/* 4e de couverture */}
        <mesh position={[0, 0, -D / 2 + C / 2]} material={backMaterials}>
          <boxGeometry args={[W, H, C]} />
        </mesh>
        {/* Dos (tranche) */}
        <mesh position={[-W / 2 + C / 2 - 0.004, 0, 0]} material={spineMaterials}>
          <boxGeometry args={[C, H + 0.004, D + 0.006]} />
        </mesh>
        {/* Couverture, articulée sur la charnière */}
        <group ref={hinge} position={[-W / 2 + C / 2, 0, D / 2 - C / 2]}>
          <mesh position={[W / 2 - C / 2, 0, 0]} material={frontMaterials}>
            <boxGeometry args={[W, H, C]} />
          </mesh>
        </group>
      </group>
      <ContactShadows
        position={[0, -H / 2 - 0.32, 0]}
        scale={5}
        blur={2.8}
        far={2.4}
        opacity={0.55}
        resolution={512}
        color="#000814"
      />
    </group>
  )
}
