import baseSchema from "@enjoy/schema/auth/base.schema";
import userSchema from "@enjoy/schema/auth/user.schema";
import type { schema } from "@enjoy/server/db";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type z from "zod";

export type Auth = {
  userId: string;
  email: string;
};

export type User = InferSelectModel<typeof schema.users>;
export type Token = InferSelectModel<typeof schema.tokens>;
export type InsertToken = InferInsertModel<typeof schema.tokens>;

export type LoginSchema = z.infer<typeof baseSchema.login>;
export type RegisterSchema = z.infer<typeof baseSchema.register>;
export type TokenSchema = z.infer<typeof baseSchema.token>;

export type UserSelect = z.infer<typeof userSchema.select>;
export type UserCreate = z.infer<typeof userSchema.create>;
export type UserUpdate = z.infer<typeof userSchema.update>;
