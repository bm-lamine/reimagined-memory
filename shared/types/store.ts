import type { InferSelectModel } from "drizzle-orm";
import type z from "zod";

import type MediaClass from "schema/store/media";
import type RequestSchema from "schema/store/request";
import type UnitSchema from "schema/store/unit";
import type { schema } from "server/src/database";

export type Media = z.infer<typeof MediaClass.schema>;

export type Unit = InferSelectModel<typeof schema.units>;
export type UnitCreate = z.infer<typeof UnitSchema.create>;
export type UnitUpdate = z.infer<typeof UnitSchema.update>;

export type Request = InferSelectModel<typeof schema.requests>;
export type RequestCreate = z.infer<typeof RequestSchema.create>;
export type RequestUpdate = z.infer<typeof RequestSchema.update>;
