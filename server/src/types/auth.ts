import type { schema } from "#/database";
import type { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof schema.users>;

export type VerificationType = "email-verification" | "password-reset";

export type Auth = {
  id: string;
  email: string;
};
