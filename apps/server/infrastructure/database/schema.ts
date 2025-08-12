import cuid2 from "@paralleldrive/cuid2";
import { pgSchema } from "drizzle-orm/pg-core";

export const auth = pgSchema("auth");

export const users = auth.table("users", (db) => ({
  id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
  name: db.varchar().notNull(),
  email: db.varchar().unique().notNull(),
  emailVerifiedAt: db.timestamp({ mode: "date", withTimezone: true }),
  password: db.varchar().notNull(),
}));
