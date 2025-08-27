import { schema } from "@enjoy/server/db";
import * as drizzleZod from "drizzle-zod";
import z from "zod";

export default class {
  static readonly select = drizzleZod
    .createSelectSchema(schema.users, {
      email: z.email(),
    })
    .omit({ id: true, password: true })
    .partial();

  static readonly create = drizzleZod
    .createInsertSchema(schema.users, {
      email: z.email(),
    })
    .omit({ id: true });

  static readonly update = drizzleZod
    .createUpdateSchema(schema.users, {
      email: z.email().optional(),
    })
    .omit({ id: true });
}
