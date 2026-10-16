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

const isRemote = /^libsql:\/\//i.test(url) || /^https:\/\//i.test(url);
const isLocalFile = /^file:/i.test(url);

// Local file: URLs are opt-in for on-disk development only, gated on an
// explicit ALLOW_LOCAL_SQLITE=1 rather than NODE_ENV, because `next build`
// always runs with NODE_ENV=production even on a developer machine.
// Production stays remote-only: a misconfigured libsql:// on a host with an
// ephemeral or read-only filesystem falls back to a local disk path, which is
// a silent data-loss failure mode rather than a loud config error.
const localAllowed = process.env.ALLOW_LOCAL_SQLITE === "1";

if (!isRemote && !(isLocalFile && localAllowed)) {
  throw new Error(
    "TURSO_DATABASE_URL/DATABASE_URL must be a remote Turso/libSQL URL (libsql:// or https://). " +
      "Set ALLOW_LOCAL_SQLITE=1 to use a local file: database during development.",
  );
}

// An auth token is only meaningful for a remote database.
if (isRemote && !authToken) {
  throw new Error("TURSO_AUTH_TOKEN or DATABASE_AUTH_TOKEN is required for the Turso/libSQL database.");
}

const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, {
  schema: {
    ...schema,
    ...financeSchema,
  },
});

export type DB = typeof db;
