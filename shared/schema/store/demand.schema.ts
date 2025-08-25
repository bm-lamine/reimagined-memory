import { schema } from "@enjoy/server/db";
import * as drizzleZod from "drizzle-zod";

export default class {
  static readonly select = drizzleZod
    .createSelectSchema(schema.demands)
    .omit({
      id: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    })
    .partial();

  static readonly create = drizzleZod.createInsertSchema(schema.demands).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

  static readonly update = drizzleZod.createUpdateSchema(schema.demands).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });
}
