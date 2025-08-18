import type AuthSchema from "schema/auth";
import type VerifyEmailSchema from "schema/auth/verification";
import type z from "zod";

export type VerificationType = "email-verification" | "password-reset";

export type Auth = {
  id: string;
  email: string;
};

export type Login = z.infer<typeof AuthSchema.login>;
export type Register = z.infer<typeof AuthSchema.register>;

export type Resend = z.infer<typeof VerifyEmailSchema.resend>;
export type verify = z.infer<typeof VerifyEmailSchema.verify>;
