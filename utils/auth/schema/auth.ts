import z from "zod";

export class AuthSchema {
  static readonly login = z.object({
    email: z.email({ error: "email required" }),
    password: z.string({ error: "password required" }),
  });

  static readonly register = z.object({
    email: z.email({ error: "email required" }),
    password: z.string({ error: "password required" }).min(6),
    name: z.string({ error: "name required" }),
  });
}

export class VerifyEmailSchema {
  static readonly resend = z.object({
    email: z.email({ error: "email required" }),
  });

  static readonly verify = z.object({
    email: z.email({ error: "email required" }),
    otp: z.string({ error: "otp required" }),
  });
}
