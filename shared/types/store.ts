import type { InferSelectModel } from "drizzle-orm";
import type z from "zod";

import type mediaSchema from "schema/store/media.schema";
import type offerSchema from "schema/store/offer.schema";
import type productSchema from "schema/store/product.schema";
import type requestSchema from "schema/store/request.schema";
import type unitSchema from "schema/store/unit.schema";
import type * as database from "server/src/database";
import type responseSchema from "schema/store/response.schema";

export type Media = z.infer<typeof mediaSchema>;

export type Unit = InferSelectModel<typeof database.schema.units>;
export type UnitCreate = z.infer<typeof unitSchema.create>;
export type UnitUpdate = z.infer<typeof unitSchema.update>;

export type Request = InferSelectModel<typeof database.schema.requests>;
export type RequestCreate = z.infer<typeof requestSchema.create>;
export type RequestUpdate = z.infer<typeof requestSchema.update>;

export type Offer = InferSelectModel<typeof database.schema.offers>;
export type OfferCreate = z.infer<typeof offerSchema.create>;
export type OfferUpdate = z.infer<typeof offerSchema.update>;

export type Product = InferSelectModel<typeof database.schema.products>;
export type ProductCreate = z.infer<typeof productSchema.create>;
export type ProductUpdate = z.infer<typeof productSchema.update>;

export type Response = InferSelectModel<typeof database.schema.products>;
export type ResponseCreate = z.infer<typeof responseSchema.create>;
export type ResponseUpdate = z.infer<typeof responseSchema.update>;
