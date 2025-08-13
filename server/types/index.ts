import type { schema } from "#/infrastructure/database";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof schema.users>;
export type Unit = InferSelectModel<typeof schema.units>;
