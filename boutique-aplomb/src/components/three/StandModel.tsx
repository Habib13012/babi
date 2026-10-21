"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/**
 * PROTOTYPE PROCÉDURAL — rendu indicatif d'un support pliable en « Z ».
 * Il ne reproduit pas le produit commercial : proportions, finitions et
 * mécanisme réels seront ceux du modèle fourni par le fabricant (GLB).
 *
 * Unités : 1 = 10 cm. `fold` : 0 = replié à plat, 1 = déplié.
 */

export type Highlight = "none" | "hinge" | "tray" | "pads";

export interface StandState {
  fold: number;
  highlight: Highlight;
}

const BASE = { w: 2.5, h: 0.05, d: 2.2 };
const ARM_LEN = 1.75;
const HINGE_Z = 0.95;
const TRAY = { w: 2.45, d: 2.2, hingeFromBack: 0.35 };

const lerp = THREE.MathUtils.lerp;

export function StandModel({ color, stateRef }: { color: string; stateRef: RefObject<StandState> }) {
  const arm = useRef<THREE.Group>(null);
  const tray = useRef<THREE.Group>(null);
  const fold = useRef<number | null>(null);
  const glow = useRef({ hinge: 0, tray: 0, pads: 0 });

  const mats = useMemo(
    () => ({
      metal: new THREE.MeshPhysicalMaterial({ color, metalness: 0.92, roughness: 0.34, clearcoat: 0.25, clearcoatRoughness: 0.4 }),
      metalDark: new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(0.7), metalness: 0.9, roughness: 0.42 }),
      hinge: new THREE.MeshStandardMaterial({ color: "#1d1f22", metalness: 0.6, roughness: 0.5, emissive: "#a44a23", emissiveIntensity: 0 }),
      pad: new THREE.MeshStandardMaterial({ color: "#26282b", roughness: 0.9, metalness: 0, emissive: "#d9875f", emissiveIntensity: 0 }),
      trayGlow: new THREE.MeshBasicMaterial({ color: "#d9875f", transparent: true, opacity: 0 }),
    }),
    [color],
  );
  // Les matériaux sont animés image par image via une référence (hors cycle de rendu React).
  const live = useRef(mats);
  useEffect(() => {
    live.current = mats;
    return () => Object.values(mats).forEach((m) => m.dispose());
  }, [mats]);
  const { metal, metalDark, hinge: hingeMat, pad: padMat, trayGlow: trayGlowMat } = mats;

  useFrame((_, dt) => {
    const s = stateRef.current;
    if (!s) return;
    const k = 1 - Math.exp(-dt * 6);
    fold.current = fold.current === null ? s.fold : lerp(fold.current, s.fold, k);
    const f = fold.current;

    const a1 = lerp(0.035, 0.78, f); // inclinaison du bras
    const tilt = lerp(0, 0.24, f); // pente du plateau vers l'utilisateur
    if (arm.current) arm.current.rotation.x = a1;
    if (tray.current) {
      const tipY = BASE.h + Math.sin(a1) * ARM_LEN;
      const tipZ = HINGE_Z - Math.cos(a1) * ARM_LEN;
      tray.current.position.set(0, tipY + 0.03, tipZ);
      tray.current.rotation.x = tilt;
    }

    const g = glow.current;
    g.hinge = lerp(g.hinge, s.highlight === "hinge" ? 1 : 0, k);
    g.tray = lerp(g.tray, s.highlight === "tray" ? 1 : 0, k);
    g.pads = lerp(g.pads, s.highlight === "pads" ? 1 : 0, k);
    const m = live.current;
    m.hinge.emissiveIntensity = g.hinge * 1.6;
    m.pad.emissiveIntensity = g.pads * 1.4;
    m.trayGlow.opacity = g.tray * 0.35;
  });

  const slats = 7;
  const slatGap = TRAY.d / (slats * 2 + 1);

  return (
    <group>
      {/* Base */}
      <RoundedBox args={[BASE.w, BASE.h, BASE.d]} radius={0.02} smoothness={3} position={[0, BASE.h / 2, 0]} material={metal} castShadow receiveShadow />
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}${z}`} position={[x * 1.05, -0.01, z * 0.9]} material={padMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 20]} />
          </mesh>
        )),
      )}

      {/* Charnière avant + bras */}
      <mesh position={[0, BASE.h + 0.03, HINGE_Z]} rotation={[0, 0, Math.PI / 2]} material={hingeMat}>
        <cylinderGeometry args={[0.045, 0.045, BASE.w - 0.2, 24]} />
      </mesh>
      <group ref={arm} position={[0, BASE.h + 0.03, HINGE_Z]}>
        {[-1, 1].map((x) => (
          <RoundedBox key={x} args={[0.12, 0.05, ARM_LEN]} radius={0.018} smoothness={2} position={[x * 1.0, 0, -ARM_LEN / 2]} material={metalDark} castShadow />
        ))}
        <RoundedBox args={[2.12, 0.05, 0.16]} radius={0.018} smoothness={2} position={[0, 0, -ARM_LEN + 0.08]} material={metalDark} />
      </group>

      {/* Plateau ajouré */}
      <group ref={tray}>
        <group position={[0, 0, TRAY.d / 2 - TRAY.hingeFromBack]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.01, -TRAY.d / 2 + TRAY.hingeFromBack]} material={hingeMat}>
            <cylinderGeometry args={[0.045, 0.045, TRAY.w - 0.3, 24]} />
          </mesh>
          {[-1, 1].map((x) => (
            <RoundedBox key={x} args={[0.16, 0.045, TRAY.d]} radius={0.018} smoothness={2} position={[x * (TRAY.w / 2 - 0.08), 0, 0]} material={metal} castShadow />
          ))}
          {Array.from({ length: slats }, (_, i) => (
            <RoundedBox
              key={i}
              args={[TRAY.w - 0.3, 0.035, slatGap]}
              radius={0.012}
              smoothness={2}
              position={[0, 0, -TRAY.d / 2 + slatGap * (2 * i + 1.5)]}
              material={metal}
              castShadow
            />
          ))}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} material={trayGlowMat}>
            <planeGeometry args={[TRAY.w, TRAY.d]} />
          </mesh>
          {/* Patins du plateau */}
          {[-1, 1].map((x) => (
            <RoundedBox key={x} args={[0.1, 0.02, TRAY.d - 0.5]} radius={0.008} smoothness={2} position={[x * 0.75, 0.032, 0.05]} material={padMat} />
          ))}
          {/* Butée avant */}
          <RoundedBox args={[TRAY.w, 0.16, 0.05]} radius={0.02} smoothness={2} position={[0, 0.06, TRAY.d / 2 - 0.025]} material={metal} castShadow />
        </group>
      </group>
    </group>
  );
}
