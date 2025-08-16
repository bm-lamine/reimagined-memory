import z from "zod";

export class UserSchema {
  static readonly create = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
  });

  static readonly update = this.create
    .extend({ emailVerifiedAt: z.date() })
    .partial();
}
