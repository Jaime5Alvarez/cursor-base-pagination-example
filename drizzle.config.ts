import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "@/config/server-constants";

export default defineConfig({
  out: "./src/modules/database/infrastructure/drizzle",
  schema: "./src/modules/database/infrastructure/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
