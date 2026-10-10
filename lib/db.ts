import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/drizzle/schema";
import * as financeSchema from "@/drizzle/finance-schema";
import fs from "node:fs";
import path from "node:path";

type DrizzleDb = ReturnType<typeof drizzle>;

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

function openDb(): DrizzleDb {
  const dbPath = resolveDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath, { timeout: 10_000 });
  sqlite.pragma("busy_timeout = 10000");

  try {
    sqlite.pragma("journal_mode = WAL");
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code ?? "")
        : "";

    if (code !== "SQLITE_BUSY" && code !== "SQLITE_LOCKED") {
      sqlite.close();
      throw error;
    }
  }

  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema: { ...schema, ...financeSchema } });
}

declare global {
  var _sqliteDb: DrizzleDb | undefined;
}

function getDb(): DrizzleDb {
  if (globalThis._sqliteDb) return globalThis._sqliteDb;

  const instance = openDb();
  globalThis._sqliteDb = instance;
  return instance;
}

// Keep database initialization lazy. Public content helpers already wrap their
// queries in try/catch; deferring the open until a query is actually executed
// means an unavailable serverless SQLite path degrades to []/null instead of
// crashing the route during module evaluation.
const db = new Proxy({} as DrizzleDb, {
  get(_target, property) {
    const instance = getDb();
    const value = Reflect.get(instance as object, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { db };
export type DB = DrizzleDb;
