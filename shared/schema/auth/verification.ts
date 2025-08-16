import z from "zod";

export default class VerifyEmailSchema {
  static readonly resend = z.object({
    email: z.email({ error: "email required" }),
  });

  static readonly verify = z.object({
    email: z.email({ error: "email required" }),
    otp: z.string({ error: "otp required" }),
  });
}
