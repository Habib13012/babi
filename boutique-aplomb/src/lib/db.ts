import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";
import type { StoreData } from "@/data/types";

/**
 * Persistance des commandes, du stock et des événements de paiement.
 *
 * SQLite intégré à Node (node:sqlite, Node ≥ 22.13) : aucune dépendance
 * native. Le fichier doit se trouver sur un disque persistant ; pour un
 * hébergement serverless sans disque, remplacer ce module par Postgres
 * en conservant la même interface.
 */

// Chargé à l'exécution pour que le bundler ne tente pas de résoudre le module.
const { DatabaseSync } = process.getBuiltinModule("node:sqlite") as typeof import("node:sqlite");

export type OrderStatus = "pending" | "paid" | "expired" | "failed" | "needs_review";

export interface OrderRow {
  id: string;
  status: OrderStatus;
  checkout_session_id: string | null;
  lines_json: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shipping_method_id: string;
  terms_version: string;
  terms_accepted_at: string;
  email: string | null;
  customer_name: string | null;
  shipping_address_json: string | null;
  confirmation_email_sent: number;
  review_reason: string | null;
  created_at: string;
  paid_at: string | null;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  checkout_session_id TEXT UNIQUE,
  lines_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  currency TEXT NOT NULL,
  shipping_method_id TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  terms_accepted_at TEXT NOT NULL,
  email TEXT,
  customer_name TEXT,
  shipping_address_json TEXT,
  confirmation_email_sent INTEGER NOT NULL DEFAULT 0,
  review_reason TEXT,
  created_at TEXT NOT NULL,
  paid_at TEXT
);
CREATE TABLE IF NOT EXISTS processed_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  processed_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS inventory (
  variant_id TEXT PRIMARY KEY,
  stock INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS withdrawals (
  id TEXT PRIMARY KEY,
  order_reference TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  items TEXT,
  created_at TEXT NOT NULL
);
`;

let instance: DatabaseSyncType | null = null;

export function openDb(file = process.env.ORDERS_DB_PATH ?? "data/orders.sqlite"): DatabaseSyncType {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(path.resolve(/*turbopackIgnore: true*/ file)), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  return db;
}

export function getDb(): DatabaseSyncType {
  instance ??= openDb();
  return instance;
}

/** Charge le stock initial des variantes absentes de la base (n'écrase jamais un stock existant). */
export function seedInventory(db: DatabaseSyncType, data: StoreData) {
  const insert = db.prepare("INSERT OR IGNORE INTO inventory (variant_id, stock) VALUES (?, ?)");
  for (const v of data.product.variants) insert.run(v.id, v.initialStock);
}

export function getStock(db: DatabaseSyncType, variantId: string): number {
  const row = db.prepare("SELECT stock FROM inventory WHERE variant_id = ?").get(variantId) as { stock: number } | undefined;
  return row?.stock ?? 0;
}

export function getStockMap(db: DatabaseSyncType, data: StoreData): Record<string, number> {
  seedInventory(db, data);
  return Object.fromEntries(data.product.variants.map((v) => [v.id, v.available ? getStock(db, v.id) : 0]));
}

export function transaction<T>(db: DatabaseSyncType, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export function insertOrder(
  db: DatabaseSyncType,
  o: Pick<OrderRow, "id" | "lines_json" | "subtotal" | "shipping" | "total" | "currency" | "shipping_method_id" | "terms_version" | "terms_accepted_at">,
) {
  db.prepare(
    `INSERT INTO orders (id, status, lines_json, subtotal, shipping, total, currency, shipping_method_id, terms_version, terms_accepted_at, created_at)
     VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(o.id, o.lines_json, o.subtotal, o.shipping, o.total, o.currency, o.shipping_method_id, o.terms_version, o.terms_accepted_at, new Date().toISOString());
}

export function attachSession(db: DatabaseSyncType, orderId: string, sessionId: string) {
  db.prepare("UPDATE orders SET checkout_session_id = ? WHERE id = ?").run(sessionId, orderId);
}

export function getOrder(db: DatabaseSyncType, id: string): OrderRow | undefined {
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
}

export function getOrderBySession(db: DatabaseSyncType, sessionId: string): OrderRow | undefined {
  return db.prepare("SELECT * FROM orders WHERE checkout_session_id = ?").get(sessionId) as OrderRow | undefined;
}

export function insertWithdrawal(db: DatabaseSyncType, w: { id: string; orderReference: string; name: string; email: string; items?: string }) {
  db.prepare("INSERT INTO withdrawals (id, order_reference, name, email, items, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    w.id,
    w.orderReference,
    w.name,
    w.email,
    w.items ?? null,
    new Date().toISOString(),
  );
}
