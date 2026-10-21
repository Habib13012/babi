"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "@/lib/pricing";

/**
 * Panier conservé dans le navigateur (stockage strictement nécessaire au
 * service demandé). Les montants sont toujours recalculés par le serveur.
 */
const KEY = "aplomb.cart.v1";

interface CartApi {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartApi | null>(null);

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine => typeof l?.variantId === "string" && Number.isInteger(l?.quantity) && l.quantity > 0 && l.quantity < 100,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children, maxQuantity }: { children: ReactNode; maxQuantity: number }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Lecture différée : le stockage local n'existe pas pendant le rendu serveur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setLines(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible (navigation privée) : le panier reste en mémoire */
    }
  }, []);

  const api = useMemo<CartApi>(() => {
    const total = lines.reduce((n, l) => n + l.quantity, 0);
    const clamp = (variantId: string, q: number) => {
      const others = lines.filter((l) => l.variantId !== variantId).reduce((n, l) => n + l.quantity, 0);
      return Math.max(0, Math.min(q, maxQuantity - others));
    };
    return {
      lines,
      count: total,
      ready,
      add: (variantId, quantity = 1) => {
        const current = lines.find((l) => l.variantId === variantId)?.quantity ?? 0;
        const q = clamp(variantId, current + quantity);
        if (q === 0) return;
        persist(current ? lines.map((l) => (l.variantId === variantId ? { ...l, quantity: q } : l)) : [...lines, { variantId, quantity: q }]);
      },
      setQuantity: (variantId, quantity) => {
        const q = clamp(variantId, quantity);
        persist(q === 0 ? lines.filter((l) => l.variantId !== variantId) : lines.map((l) => (l.variantId === variantId ? { ...l, quantity: q } : l)));
      },
      remove: (variantId) => persist(lines.filter((l) => l.variantId !== variantId)),
      clear: () => persist([]),
    };
  }, [lines, ready, maxQuantity, persist]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>.");
  return ctx;
}
