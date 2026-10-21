import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { ScrollTrigger } from '../lib/gsap'
import { Book } from './Book'
import { isOffstage, measureChoreography, targetPose, type Pose } from './choreography'

type Props = { reducedMotion: boolean; onContextLost: () => void }

/** Met la boucle de rendu en pause quand le livre est hors champ (sections pleines). */
function FrameloopController() {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    const probe: Pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, open: 0, flip: 0 }
    let running = true
    let idle: number | undefined
    const check = () => {
      targetPose(window.scrollY, probe)
      const visible = !isOffstage(probe)
      if (visible && !running) {
        window.clearTimeout(idle)
        running = true
        setFrameloop('always')
      } else if (!visible && running) {
        window.clearTimeout(idle)
        // on laisse le temps au livre de finir sa sortie avant de couper
        idle = window.setTimeout(() => {
          running = false
          setFrameloop('never')
        }, 1200)
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => {
      window.removeEventListener('scroll', check)
      window.clearTimeout(idle)
    }
  }, [setFrameloop])
  return null
}

function Measure() {
  useEffect(() => {
    const measure = () => measureChoreography()
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('resize', measure)
    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])
  return null
}

export default function Experience({ reducedMotion, onContextLost }: Props) {
  // Le livre apparaît en fondu à sa première image : la page est déjà affichée et lisible avant
  const [shown, setShown] = useState(false)
  const onReady = useCallback(() => setShown(true), [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ease-out"
      style={{ opacity: shown ? 1 : 0 }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.6], fov: 32, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.05
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            onContextLost()
          })
        }}
      >
        <Measure />
        <FrameloopController />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3.5, 4, 6]} intensity={2.1} color="#fff6ec" />
        <pointLight position={[-4, 1.5, -2]} intensity={28} color="#e8843c" distance={14} />
        <pointLight position={[4, -2, 3]} intensity={6} color="#7fa6c9" distance={12} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.2} position={[0, 2.5, 6]} scale={[8, 2.5, 1]} />
          <Lightformer form="rect" intensity={1.4} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 8, 1]} color="#ffd9b8" />
          <Lightformer form="rect" intensity={0.9} position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} color="#bcd3ea" />
          <Lightformer form="ring" intensity={1.2} position={[2, 4, -4]} scale={2} color="#e8843c" />
        </Environment>
        <Suspense fallback={null}>
          <Book reducedMotion={reducedMotion} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  )
}
