import mediaSchema from "@enjoy/schema/store/media.schema";
import unitSchema from "@enjoy/schema/store/unit.schema";
import categorySchema from "@enjoy/schema/store/category.schema";
import { schema } from "@enjoy/server/db";
import type { InferSelectModel } from "drizzle-orm";
import z from "zod";

export type Unit = InferSelectModel<typeof schema.units>;
export type Category = InferSelectModel<typeof schema.categories>;

export type Media = z.infer<typeof mediaSchema>;
export type UnitSelect = z.infer<typeof unitSchema.select>;
export type UnitCreate = z.infer<typeof unitSchema.create>;
export type UnitUpdate = z.infer<typeof unitSchema.update>;

export type CategorySelect = z.infer<typeof categorySchema.select>;
export type CategoryCreate = z.infer<typeof categorySchema.create>;
export type CategoryUpdate = z.infer<typeof categorySchema.update>;
