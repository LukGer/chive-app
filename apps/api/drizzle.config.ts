import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/database/schema.ts", "./src/database/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
