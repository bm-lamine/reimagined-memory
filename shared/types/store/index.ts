import categorySchema from "@enjoy/schema/store/category.schema";
import demandSchema from "@enjoy/schema/store/demand.schema";
import mediaSchema from "@enjoy/schema/store/media.schema";
import unitSchema from "@enjoy/schema/store/unit.schema";
import { schema } from "@enjoy/server/db";
import type { InferSelectModel } from "drizzle-orm";
import z from "zod";

export type Unit = InferSelectModel<typeof schema.units>;
export type Category = InferSelectModel<typeof schema.categories>;
export type Demand = InferSelectModel<typeof schema.demands>;

export type Media = z.infer<typeof mediaSchema>;
export type UnitSelect = z.infer<typeof unitSchema.select>;
export type UnitCreate = z.infer<typeof unitSchema.create>;
export type UnitUpdate = z.infer<typeof unitSchema.update>;

export type CategorySelect = z.infer<typeof categorySchema.select>;
export type CategoryCreate = z.infer<typeof categorySchema.create>;
export type CategoryUpdate = z.infer<typeof categorySchema.update>;

export type DemandSelect = z.infer<typeof demandSchema.select>;
export type DemandCreate = z.infer<typeof demandSchema.create>;
export type DemandUpdate = z.infer<typeof demandSchema.update>;
