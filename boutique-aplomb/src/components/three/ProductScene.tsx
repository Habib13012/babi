"use client";

import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { ProductModel } from "@/data/types";
import { StandModel, type StandState } from "./StandModel";

export interface CameraKey {
  position: [number, number, number];
  target: [number, number, number];
}

export interface SceneProps {
  model: ProductModel;
  color: string;
  stateRef: RefObject<StandState>;
  /** Mode « héro » : rotation libre. Mode « récit » : caméra pilotée par le défilement. */
  mode: "hero" | "story";
  cameraRef?: RefObject<CameraKey>;
  /** Position initiale de la caméra (mode récit). */
  initialCamera?: CameraKey;
  active: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
  onReady?: () => void;
}

const HERO_CAMERA: CameraKey = { position: [4.6, 3.1, 5.2], target: [0, 0.55, 0] };

function GltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/** Apparition progressive + parallaxe légère au défilement (mode héro). */
function Stage({ children, reducedMotion, mode }: { children: React.ReactNode; reducedMotion: boolean; mode: SceneProps["mode"] }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(reducedMotion ? 1 : 0);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    t.current = Math.min(1, t.current + dt / 1.4);
    const e = 1 - Math.pow(1 - t.current, 3);
    const s = 0.86 + 0.14 * e;
    g.scale.setScalar(s);
    const scroll = mode === "hero" && !reducedMotion ? Math.min(window.scrollY / window.innerHeight, 1) : 0;
    g.position.y = (1 - e) * -0.4 + scroll * 0.5;
    g.rotation.y = (1 - e) * -0.6 + scroll * 0.5;
  });
  return <group ref={group}>{children}</group>;
}

/** Caméra interpolée vers la clé courante (mode récit). */
function StoryCamera({ cameraRef, reducedMotion }: { cameraRef: RefObject<CameraKey>; reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(...HERO_CAMERA.target));
  const pos = useRef(new THREE.Vector3());
  const tgt = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const key = cameraRef.current;
    if (!key) return;
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 3.5);
    camera.position.lerp(pos.current.set(...key.position), k);
    target.current.lerp(tgt.current.set(...key.target), k);
    camera.lookAt(target.current);
  });
  return null;
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function ProductScene(props: SceneProps) {
  const { model, color, stateRef, mode, cameraRef, initialCamera, active, reducedMotion, lowPower, onReady } = props;
  const cam = initialCamera ?? HERO_CAMERA;

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? [1, 1.4] : [1, 1.8]}
      camera={{ position: cam.position, fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: !lowPower, powerPreference: lowPower ? "low-power" : "high-performance", alpha: true }}
      onCreated={({ camera }) => camera.lookAt(...cam.target)}
      aria-hidden="true"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} />
      <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#ffe2cf" />
      <Environment resolution={lowPower ? 64 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffd9c2" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="circle" intensity={2} position={[0, 4, 4]} scale={2} />
      </Environment>

      <Suspense fallback={null}>
        <Stage reducedMotion={reducedMotion} mode={mode}>
          {model.type === "gltf" ? <GltfModel url={model.url} /> : <StandModel color={color} stateRef={stateRef} />}
        </Stage>
        <ReadySignal onReady={onReady} />
      </Suspense>

      <ContactShadows position={[0, -0.02, 0]} opacity={0.42} scale={9} blur={2.6} far={3} resolution={lowPower ? 256 : 512} color="#15171a" />

      {mode === "hero" ? (
        <OrbitControls
          target={HERO_CAMERA.target}
          enablePan={false}
          enableZoom={false}
          enableDamping
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.55}
          minPolarAngle={0.55}
          maxPolarAngle={1.42}
          rotateSpeed={0.7}
        />
      ) : (
        cameraRef && <StoryCamera cameraRef={cameraRef} reducedMotion={reducedMotion} />
      )}
    </Canvas>
  );
}
