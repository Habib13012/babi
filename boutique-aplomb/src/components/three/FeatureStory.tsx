"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ProductModel } from "@/data/types";
import type { CameraKey } from "./ProductScene";
import type { Highlight, StandState } from "./StandModel";
import { StandIllustration } from "./StandIllustration";
import { PrototypeNotice } from "./HeroViewer";
import { useInView, useViewerEnv } from "./useViewerEnv";

const ProductScene = dynamic(() => import("./ProductScene"), { ssr: false });

export interface StoryStep {
  eyebrow: string;
  title: string;
  body: string;
}

const KEYS: { fold: number; highlight: Highlight; camera: CameraKey }[] = [
  { fold: 0, highlight: "none", camera: { position: [4.5, 5.9, 6.2], target: [0, 0.1, 0] } },
  { fold: 1, highlight: "hinge", camera: { position: [8.7, 2.0, 0.6], target: [0, 0.6, 0] } },
  { fold: 1, highlight: "tray", camera: { position: [0.8, 9.0, 3.4], target: [0, 0.8, 0] } },
  { fold: 1, highlight: "pads", camera: { position: [-5.3, 3.1, 6.7], target: [0, 0.5, 0] } },
];

/**
 * Récit au défilement : le texte (HTML) porte toute l'information ;
 * la 3D l'illustre. Sans WebGL ou avec mouvement réduit, le contenu reste complet.
 */
export function FeatureStory({ steps, model, color }: { steps: StoryStep[]; model: ProductModel; color: string }) {
  const env = useViewerEnv();
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const near = useInView(section, { once: true, margin: "400px" });
  const visible = useInView(stage, { margin: "0px" });
  const [active, setActive] = useState(0);
  const state = useRef<StandState>({ fold: 0, highlight: "none" });
  const camera = useRef<CameraKey>(KEYS[0]!.camera);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = stepRefs.current.filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const k = KEYS[Math.min(active, KEYS.length - 1)]!;
    state.current.fold = k.fold;
    state.current.highlight = k.highlight;
    camera.current = k.camera;
  }, [active]);

  const show3d = env.known && env.webgl && near;

  return (
    <div ref={section} className="relative grid gap-10 md:grid-cols-2 md:gap-16">
      <div ref={stage} className="top-24 h-[52vh] md:sticky md:h-[calc(100vh-8rem)]">
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-mist to-chalk">
          {show3d ? (
            <ProductScene model={model} color={color} stateRef={state} cameraRef={camera} initialCamera={KEYS[0]!.camera} mode="story" active={visible} reducedMotion={env.reducedMotion} lowPower={env.lowPower} />
          ) : (
            <StandIllustration className="h-full w-full p-10" color={color} />
          )}
          <div className="absolute bottom-4 left-5">
            <PrototypeNotice model={model} />
          </div>
          <ol className="absolute right-5 top-5 flex gap-1.5" aria-hidden="true">
            {steps.map((_, i) => (
              <li key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-copper" : "w-1.5 bg-ink/20"}`} />
            ))}
          </ol>
        </div>
      </div>

      <ol className="space-y-[28vh] py-[8vh] md:py-[24vh]">
        {steps.map((s, i) => (
          <li
            key={s.title}
            data-step={i}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className={`border-l-2 pl-6 transition-colors duration-700 ${i === active ? "border-copper" : "border-ink/10"}`}
          >
            <p className="eyebrow">{s.eyebrow}</p>
            <h3 className="mt-3 text-3xl md:text-4xl">{s.title}</h3>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-graphite/80">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
