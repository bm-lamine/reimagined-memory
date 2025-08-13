import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "#/src/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const db = drizzle(conn, {
  logger: env.NODE_ENV === "development",
});

export { db, schema };
