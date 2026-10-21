import { demoData } from "./demo";
import { productionData } from "./production";
import type { DataMode, StoreData } from "./types";

export function getDataMode(): DataMode {
  return process.env.STORE_DATA_MODE === "production" ? "production" : "demo";
}

export function getStoreData(mode: DataMode = getDataMode()): StoreData {
  return mode === "production" ? productionData : demoData;
}

export const store = getStoreData();
export const product = store.product;
export const isDemo = store.mode === "demo";

export type * from "./types";
