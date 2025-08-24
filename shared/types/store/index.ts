import { InferSelectModel } from "drizzle-orm";
import { schema } from "@enjoy/server/db";

export type Unit = InferSelectModel<typeof schema.units>;
