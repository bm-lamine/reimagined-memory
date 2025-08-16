import { type Config } from "drizzle-kit";

import { env } from "#/config/env";

export default {
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  breakpoints: false,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
} satisfies Config;
