import type { Media } from "@enjoy/types/store";
import { createId } from "@paralleldrive/cuid2";
import { foreignKey, pgSchema, primaryKey, unique } from "drizzle-orm/pg-core";

export const auth = pgSchema("auth");

export const users = auth.table(
  "users",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    name: c.varchar().notNull(),
    email: c.varchar().notNull(),
    password: c.varchar().notNull(),
    isActive: c.boolean().default(false).notNull(),
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
    unique("unique_user_email").on(t.email),
  ]
);

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
    image: c.jsonb().$type<Media>().notNull(),
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

export const subs = store.table(
  "subs",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    name: c.varchar().notNull(),
    categoryId: c.varchar().notNull(),
  }),
  (t) => [
    primaryKey({ columns: [t.id] }),
    unique("unique_sub_category_name").on(t.name),
    foreignKey({ columns: [t.categoryId], foreignColumns: [categories.id] }),
  ]
);

export const products = store.table(
  "products",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    name: c.varchar().notNull(),
    description: c.varchar(),
    pricePu: c.numeric({ mode: "string" }).notNull(),
    maxQty: c.numeric({ mode: "string" }),
    // categoryId: c.varchar().notNull(),
    // subId: c.varchar(),
  }),
  (t) => [
    primaryKey({ columns: [t.id] }),
    // foreignKey({ columns: [t.categoryId], foreignColumns: [categories.id] }),
    // foreignKey({ columns: [t.subId], foreignColumns: [subs.id] }),
  ]
);

export const demands = store.table(
  "demands",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    content: c.varchar().notNull(),
    userId: c.varchar().notNull(),
    images: c.jsonb().$type<Media[]>().notNull(),
    createdAt: c
      .timestamp({ mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: c
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (t) => [primaryKey({ columns: [t.id] })]
);

export const proposals = store.table(
  "proposals",
  (c) => ({
    id: c.varchar().$defaultFn(createId).notNull(),
    content: c.varchar().notNull(),
    productId: c.varchar().notNull(),
    demandId: c.varchar().notNull(),
    createdAt: c
      .timestamp({ mode: "date", withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: c
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (t) => [primaryKey({ columns: [t.id] })]
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
