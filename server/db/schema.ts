import { createId } from "@paralleldrive/cuid2";
import { pgSchema, primaryKey, unique } from "drizzle-orm/pg-core";

export const store = pgSchema("store");

export const units = store.table(
  "units",
  (c) => ({
    id: c.varchar().$defaultFn(createId),
    name: c.varchar({ length: 256 }).notNull(),
    alias: c.varchar({ length: 256 }).notNull(),
    createdAt: c
      .timestamp({ mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: c
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (t) => [
    primaryKey({ columns: [t.id] }),
    unique("unique_unit_name").on(t.name),
    unique("unique_unit_shortname").on(t.alias),
  ]
);
