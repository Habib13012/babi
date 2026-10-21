import "server-only";
import type { StoreData } from "@/data/types";
import { getDb, getStockMap } from "@/lib/db";
import type { StockMap } from "@/lib/structured-data";

/** Stock réel par variante. En cas d'erreur, tout est considéré indisponible (jamais l'inverse). */
export function currentStock(data: StoreData): StockMap {
  try {
    return getStockMap(getDb(), data);
  } catch (err) {
    console.error("[inventory] lecture du stock impossible", err);
    return Object.fromEntries(data.product.variants.map((v) => [v.id, 0]));
  }
}

export function variantOptions(data: StoreData, stock: StockMap) {
  return data.product.variants.map((v) => ({ id: v.id, name: v.name, swatch: v.swatch, inStock: v.available && (stock[v.id] ?? 0) > 0 }));
}
