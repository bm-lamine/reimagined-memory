import { type Config } from "drizzle-kit";

import { env } from "#/config/env";

export default {
  out: "./migrations",
  schema: "./src/database/schema.ts",
  breakpoints: false,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
} satisfies Config;
