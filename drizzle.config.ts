import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/archived-drizzle/schema.ts",
  out: "./database/archived-drizzle/migrations",
  dbCredentials: {
    url: process.env.LOVABLE_DB_MIGRATION_URL ?? "",
  },
});
