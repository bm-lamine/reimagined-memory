import { createId } from "@paralleldrive/cuid2";
import { pgSchema, primaryKey, unique } from "drizzle-orm/pg-core";

export const store = pgSchema("store");

export const units = store.table(
  "units",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
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

export const categories = store.table(
  "categories",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    name: c.varchar({ length: 256 }).notNull(),
    description: c.varchar(),
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
    unique("unique_category_name").on(t.name),
  ]
);

export const website = pgSchema("website");

export const complaintsSubject = website.enum("complaints_subject_enum", [
  "general_inquiry",
  "support_request",
  "feedback",
  "billing_issue",
  "partnership_opportunity",
  "job_application",
  "feature_request",
  "bug_report",
  "account_help",
  "other",
]);

export const complaints = website.table(
  "complaints",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    name: c.varchar().notNull(),
    email: c.varchar().notNull(),
    phone: c.varchar().notNull(),
    subject: complaintsSubject().default("other").notNull(),
    content: c.varchar().notNull(),
    reviewed: c.boolean().default(false),
  }),
  (t) => [primaryKey({ columns: [t.id] })]
);
