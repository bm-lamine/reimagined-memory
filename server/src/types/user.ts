import type { schema } from "#/database";
import type { UserSchema } from "#/schema/auth/user";
import type { InferSelectModel } from "drizzle-orm";
import type z from "zod";

export type User = InferSelectModel<typeof schema.users>;

export type UpdateUser = z.infer<typeof UserSchema.update>;
export type CreateUser = z.infer<typeof UserSchema.create>;
