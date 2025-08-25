import { schema } from "@enjoy/server/db";
import * as drizzleZod from "drizzle-zod";

export default class {
  static readonly select = drizzleZod
    .createSelectSchema(schema.proposals)
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
    .partial();

  static readonly create = drizzleZod
    .createInsertSchema(schema.proposals)
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    });

  static readonly update = drizzleZod
    .createUpdateSchema(schema.proposals)
    .omit({
      id: true,
      demandId: true,
      createdAt: true,
      updatedAt: true,
    });
}
