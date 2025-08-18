import type { InferSelectModel } from "drizzle-orm";
import type { UserSchema } from "schema/auth/usr/user";
import { schema } from "server/src/database";
import type z from "zod";

export type User = InferSelectModel<typeof schema.users>;

export type UpdateUser = z.infer<typeof UserSchema.update>;
export type CreateUser = z.infer<typeof UserSchema.create>;
