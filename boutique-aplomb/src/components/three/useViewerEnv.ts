"use client";

import { useEffect, useState, type RefObject } from "react";

export interface ViewerEnv {
  reducedMotion: boolean;
  lowPower: boolean;
  webgl: boolean;
  /** false tant que le navigateur n'a pas été inspecté (rendu serveur). */
  known: boolean;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useViewerEnv(): ViewerEnv {
  const [env, setEnv] = useState<ViewerEnv>({ reducedMotion: false, lowPower: true, webgl: false, known: false });
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compute = () => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      setEnv({
        reducedMotion: rm.matches,
        lowPower:
          window.matchMedia("(pointer: coarse)").matches ||
          window.innerWidth < 768 ||
          (nav.hardwareConcurrency ?? 8) <= 4 ||
          (nav.deviceMemory ?? 8) <= 4,
        webgl: hasWebGL(),
        known: true,
      });
    };
    compute();
    rm.addEventListener("change", compute);
    return () => rm.removeEventListener("change", compute);
  }, []);
  return env;
}

/** Vrai quand l'élément est (presque) visible. `once` : reste vrai après la première apparition. */
export function useInView(ref: RefObject<Element | null>, { once = false, margin = "200px" } = {}): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (once && visible) {
          setInView(true);
          io.disconnect();
        } else if (!once) setInView(visible);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin]);
  return inView;
}
