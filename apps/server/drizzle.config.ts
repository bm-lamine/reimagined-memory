import { type Config } from "drizzle-kit";

import { env } from "#/src/env";

export default {
  out: "./infrastructure/database/migrations",
  schema: "./infrastructure/database/schema.ts",
  breakpoints: false,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
} satisfies Config;
