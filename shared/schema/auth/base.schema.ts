import z from "zod";

export default class {
  static readonly register = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
  });

  static readonly login = z.object({
    email: z.email(),
    password: z.string(),
  });

  static readonly verifyEmail = z.object({
    email: z.email(),
    otp: z.string(),
  });

  static readonly resendEmailVerification = z.object({
    email: z.email(),
  });

  static readonly requestPasswordReset = z.object({
    email: z.email(),
  });

  static readonly verifyPasswordReset = z.object({
    email: z.email(),
    otp: z.string(),
  });

  static readonly resetPassword = z.object({
    email: z.email(),
    otp: z.string(),
    password: z.string(),
  });
}
