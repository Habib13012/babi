"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { ProductModel, Variant } from "@/data/types";
import type { StandState } from "./StandModel";
import { StandIllustration } from "./StandIllustration";
import { useInView, useViewerEnv } from "./useViewerEnv";

// Three.js n'est téléchargé que lorsque la scène doit s'afficher.
const ProductScene = dynamic(() => import("./ProductScene"), { ssr: false });

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function PrototypeNotice({ model }: { model: ProductModel }) {
  if (model.type === "gltf" && model.verified) return null;
  return (
    <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-steel">
      Prototype 3D — rendu indicatif, non contractuel
    </p>
  );
}

export function HeroViewer({ model, variants }: { model: ProductModel; variants: Variant[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const env = useViewerEnv();
  const near = useInView(wrap, { once: true });
  const visible = useInView(wrap);
  const [ready, setReady] = useState(false);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const state = useRef<StandState>({ fold: 0, highlight: "none" });
  const color = variants.find((v) => v.id === variantId)?.swatch ?? "#C9CCD1";

  const onReady = useCallback(() => setReady(true), []);

  // Dépliage d'introduction (immédiat si mouvement réduit).
  useEffect(() => {
    if (!ready) return;
    if (env.reducedMotion) {
      state.current.fold = 1;
      return;
    }
    const id = window.setTimeout(() => (state.current.fold = 1), 350);
    return () => window.clearTimeout(id);
  }, [ready, env.reducedMotion]);

  const poster = <StandIllustration className="h-full w-full object-contain p-6" color={color} />;
  const show3d = env.known && env.webgl && near;

  return (
    <div className="relative">
      <div ref={wrap} className="relative aspect-[5/4] w-full touch-pan-y select-none md:aspect-[6/5]">
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready && show3d ? "opacity-0" : "opacity-100"}`} aria-hidden={ready && show3d}>
          {poster}
        </div>
        {show3d && (
          <div className={`absolute inset-0 cursor-grab transition-opacity duration-1000 active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"}`}>
            <SceneBoundary fallback={null}>
              <ProductScene
                model={model}
                color={color}
                stateRef={state}
                mode="hero"
                active={visible}
                reducedMotion={env.reducedMotion}
                lowPower={env.lowPower}
                onReady={onReady}
              />
            </SceneBoundary>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <PrototypeNotice model={model} />
        {variants.length > 1 && (
          <div role="radiogroup" aria-label="Finition affichée en 3D" className="flex items-center gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={variantId === v.id}
                aria-label={`Afficher la finition ${v.name}`}
                onClick={() => setVariantId(v.id)}
                className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-paper transition ${variantId === v.id ? "ring-2 ring-ink" : "ring-1 ring-ink/20"}`}
                style={{ background: v.swatch }}
              />
            ))}
          </div>
        )}
      </div>
      {show3d && ready && <p className="sr-only">Modèle 3D interactif : faites glisser pour le faire pivoter.</p>}
    </div>
  );
}
