import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "turso",
  schema: ["./drizzle/schema.ts", "./drizzle/finance-schema.ts"],
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
});
