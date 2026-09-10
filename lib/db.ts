import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/drizzle/schema";
import * as financeSchema from "@/drizzle/finance-schema";
import path from "path";

function getDb() {
  const dbPath = path.join(process.cwd(), "local.db");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  return drizzle(sqlite, { schema: { ...schema, ...financeSchema } });
}

declare global {
  var _sqliteDb: ReturnType<typeof drizzle> | undefined;
}

const db = global._sqliteDb ?? getDb();
if (process.env.NODE_ENV !== "production") global._sqliteDb = db;

export { db };
export type DB = typeof db;
