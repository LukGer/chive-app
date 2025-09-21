import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./database/schema.ts", "./database/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
