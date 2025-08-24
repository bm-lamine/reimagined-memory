import env from "config/env";
import { type Config } from "drizzle-kit";

export default {
  out: "./db/drizzle",
  schema: "./db/schema.ts",
  breakpoints: true,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
} satisfies Config;
