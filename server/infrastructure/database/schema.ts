import cuid2 from "@paralleldrive/cuid2";
import { pgSchema, unique } from "drizzle-orm/pg-core";

export const auth = pgSchema("auth");

export const users = auth.table("users", (db) => ({
  id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
  name: db.varchar().notNull(),
  email: db.varchar().unique().notNull(),
  emailVerifiedAt: db.timestamp({ mode: "date", withTimezone: true }),
  password: db.varchar().notNull(),
}));

export const store = pgSchema("store");

export const units = store.table(
  "units",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    name: db.varchar().notNull(),
    short: db.varchar().notNull(),
    verified: db.boolean().default(true).notNull(),
  }),
  (t) => [
    unique().on(t.name),
    unique().on(t.short),
    unique().on(t.name, t.short),
  ]
);
