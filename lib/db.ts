import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/drizzle/schema";
import * as financeSchema from "@/drizzle/finance-schema";
import fs from "node:fs";
import path from "node:path";

function resolveDatabasePath() {
  const configured = process.env.DATABASE_URL?.trim();
  if (!configured) return path.join(process.cwd(), "local.db");

  if (!configured.startsWith("file:")) {
    throw new Error("DATABASE_URL must use a file: URL for the current SQLite backend.");
  }

  const rawPath = configured.slice("file:".length).split("?")[0];
  if (!rawPath) throw new Error("DATABASE_URL does not contain a SQLite file path.");

  return path.isAbsolute(rawPath)
    ? path.normalize(rawPath)
    : path.resolve(/* turbopackIgnore: true */ process.cwd(), rawPath);
}

function getDb() {
  const dbPath = resolveDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  // Next.js can evaluate route modules concurrently during production builds.
  // Configure the SQLite busy timeout before any journal-mode change so
  // parallel workers wait instead of failing with SQLITE_BUSY.
  const sqlite = new Database(dbPath, { timeout: 10_000 });
  sqlite.pragma("busy_timeout = 10000");

  try {
    sqlite.pragma("journal_mode = WAL");
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code ?? "")
        : "";

    // Another build/runtime worker may have the database open while WAL is
    // already being established. SQLite remains usable with its current
    // journal mode, so only tolerate this specific transient lock.
    if (code !== "SQLITE_BUSY" && code !== "SQLITE_LOCKED") {
      sqlite.close();
      throw error;
    }
  }

  sqlite.pragma("foreign_keys = ON");

  return drizzle(sqlite, { schema: { ...schema, ...financeSchema } });
}

declare global {
  var _sqliteDb: ReturnType<typeof drizzle> | undefined;
}

const db = globalThis._sqliteDb ?? getDb();
globalThis._sqliteDb = db;

export { db };
export type DB = typeof db;
