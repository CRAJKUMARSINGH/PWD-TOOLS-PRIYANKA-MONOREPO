/**
 * PWD Tools — Central Data Vault
 *
 * Single IndexedDB database `pwd-tools-vault` with one table:
 *   snapshots { id, tool, label, savedAt, data }
 *
 * Every tool calls saveSnapshot() to persist a named copy of its
 * current inputs. The DataVaultPage reads everything back, grouped
 * by tool, and supports export/import/restore/delete.
 *
 * This is purely additive — no existing localStorage is touched.
 */
import Dexie, { type Table } from "dexie";

// ── Schema ────────────────────────────────────────────────────────────────

export interface VaultSnapshot {
  id?: number;           // auto-increment primary key
  tool: string;          // e.g. "audit-reply" | "speed-money" | "correspondence"
  label: string;         // human-readable e.g. "Charbhuja • Agr 17 • 3 Running"
  savedAt: string;       // ISO timestamp
  data: unknown;         // the full form/state snapshot
}

// ── Dexie DB ─────────────────────────────────────────────────────────────

class VaultDB extends Dexie {
  snapshots!: Table<VaultSnapshot, number>;

  constructor() {
    super("pwd-tools-vault");
    this.version(1).stores({
      snapshots: "++id, tool, savedAt",
    });
  }
}

export const db = new VaultDB();

// ── Tool identifiers (constants for consistency) ──────────────────────────

export const VAULT_TOOL = {
  AUDIT_REPLY:      "audit-reply",
  AUDIT_FRESH:      "audit-fresh-paras",
  SPEED_MONEY:      "speed-money",
  BILL_NOTE:        "bill-note-sheet",
  CORRESPONDENCE:   "correspondence",
  EOT:              "eot-letter",
  NOTICE:           "notice",
  WORK_ORDER:       "work-order",
  RESCISSION:       "rescission-notice",
  BANK_COMM:        "bank-communication",
} as const;

export type VaultTool = (typeof VAULT_TOOL)[keyof typeof VAULT_TOOL];

// ── Core helpers ──────────────────────────────────────────────────────────

/** Save a snapshot. Returns the generated id. */
export async function saveSnapshot(
  tool: string,
  label: string,
  data: unknown,
): Promise<number> {
  return db.snapshots.add({
    tool,
    label,
    savedAt: new Date().toISOString(),
    data,
  });
}

/** Load all snapshots for a tool, newest first. */
export async function loadSnapshots(tool: string): Promise<VaultSnapshot[]> {
  return db.snapshots
    .where("tool")
    .equals(tool)
    .reverse()
    .sortBy("savedAt");
}

/** Load ALL snapshots across all tools, newest first. */
export async function loadAllSnapshots(): Promise<VaultSnapshot[]> {
  return db.snapshots.orderBy("savedAt").reverse().toArray();
}

/** Delete a single snapshot by id. */
export async function deleteSnapshot(id: number): Promise<void> {
  await db.snapshots.delete(id);
}

/** Delete ALL snapshots for a given tool. */
export async function clearToolSnapshots(tool: string): Promise<void> {
  await db.snapshots.where("tool").equals(tool).delete();
}

/** Export every snapshot as a pretty-printed JSON string (for file download). */
export async function exportAllAsJson(): Promise<string> {
  const all = await loadAllSnapshots();
  return JSON.stringify({ exportedAt: new Date().toISOString(), snapshots: all }, null, 2);
}

/**
 * Import snapshots from a JSON string previously produced by exportAllAsJson().
 * Existing data is NOT cleared — imports are additive (new ids assigned).
 * Returns the count of records imported.
 */
export async function importFromJson(jsonStr: string): Promise<number> {
  const parsed = JSON.parse(jsonStr) as { snapshots?: VaultSnapshot[] };
  if (!Array.isArray(parsed?.snapshots)) throw new Error("Invalid vault export file.");
  const records = parsed.snapshots.map(({ id: _, ...rest }) => rest); // strip old ids
  await db.snapshots.bulkAdd(records as VaultSnapshot[]);
  return records.length;
}
