import cuid2 from "@paralleldrive/cuid2";
import { foreignKey, pgSchema, unique } from "drizzle-orm/pg-core";
import type { Media } from "shared/types/store";

// * Auth Schema

export const auth = pgSchema("auth");

export const users = auth.table(
  "users",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    name: db.varchar().notNull(),
    email: db.varchar().notNull(),
    password: db.varchar().notNull(),
    emailVerifiedAt: db.timestamp({ mode: "date", withTimezone: true }),
  }),
  (t) => [unique().on(t.email)]
);

// * Store Schema

export const store = pgSchema("store");

export const offerStatus = store.enum("offer_status", [
  "pending",
  "accepted",
  "cancelled",
  "ext_requested",
  "ext_accepted",
]);

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

export const categories = store.table(
  "categories",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    name: db.varchar().notNull(),
    description: db.varchar(),
    media: db.jsonb().$type<Media>().notNull(),
  }),
  (t) => [unique().on(t.name)]
);

export const subcategories = store.table(
  "subcategories",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    name: db.varchar().notNull(),
    categoryId: db.varchar().notNull(),
  }),
  (t) => [
    foreignKey({ columns: [t.categoryId], foreignColumns: [categories.id] }),
    unique().on(t.name),
  ]
);

export const products = store.table(
  "products",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    userId: db.varchar().notNull(),
    name: db.varchar().notNull(),
    media: db.jsonb().$type<Array<Media>>().notNull(),
    pricePU: db.numeric().notNull(),
    maximumQty: db.numeric(),
  }),
  (t) => [foreignKey({ columns: [t.userId], foreignColumns: [users.id] })]
);

export const offers = store.table(
  "offers",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    productId: db.varchar().notNull(),
    userId: db.varchar().notNull(),
    mxQty: db.numeric().notNull(),
    price: db.numeric().notNull(),
    status: offerStatus().default("pending").notNull(),
    deadline: db.timestamp({ mode: "date", withTimezone: true }),
    extDeadline: db.timestamp({ mode: "date", withTimezone: true }),
    extRequest: db.boolean().default(false).notNull(),
  }),
  (t) => [
    foreignKey({ columns: [t.productId], foreignColumns: [users.id] }),
    foreignKey({ columns: [t.userId], foreignColumns: [users.id] }),
  ]
);

export const transactions = store.table(
  "transactions",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    offerId: db.varchar().notNull(),
    totalAmount: db.numeric().notNull(),
    paymentSts: db.varchar().notNull(),
    shippingSts: db.varchar().notNull(),
  }),
  (t) => [foreignKey({ columns: [t.offerId], foreignColumns: [offers.id] })]
);

export const requests = store.table(
  "requests",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    userId: db.varchar().notNull(),
    content: db.varchar().notNull(),
    media: db.jsonb().$type<Array<Media>>().notNull(),
  }),
  (t) => [foreignKey({ columns: [t.userId], foreignColumns: [users.id] })]
);

export const responses = store.table(
  "responses",
  (db) => ({
    id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
    userId: db.varchar().notNull(),
    productId: db.varchar().notNull(),
    content: db.varchar().notNull(),
  }),
  (t) => [foreignKey({ columns: [t.userId], foreignColumns: [users.id] })]
);

// * Website Schema

export const website = pgSchema("website");

export const complaints = website.table("complaints", (db) => ({
  id: db.varchar().$defaultFn(cuid2.createId).primaryKey(),
  email: db.varchar().notNull(),
  phone: db.varchar(),
  subject: db.varchar().notNull(),
  content: db.varchar().notNull(),
}));
