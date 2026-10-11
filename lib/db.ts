import "server-only";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/drizzle/schema";
import * as financeSchema from "@/drizzle/finance-schema";

const url =
  process.env.TURSO_DATABASE_URL?.trim() ||
  process.env.DATABASE_URL?.trim();
const authToken =
  process.env.TURSO_AUTH_TOKEN?.trim() ||
  process.env.DATABASE_AUTH_TOKEN?.trim();

if (!url) {
  throw new Error("TURSO_DATABASE_URL or DATABASE_URL is required.");
}

if (!/^libsql:\/\//i.test(url) && !/^https:\/\//i.test(url)) {
  throw new Error(
    "TURSO_DATABASE_URL/DATABASE_URL must be a remote Turso/libSQL URL (libsql:// or https://).",
  );
}

if (!authToken) {
  throw new Error("TURSO_AUTH_TOKEN or DATABASE_AUTH_TOKEN is required for the Turso/libSQL database.");
}

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, {
  schema: {
    ...schema,
    ...financeSchema,
  },
});

export type DB = typeof db;
