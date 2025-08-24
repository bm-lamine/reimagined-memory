import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { schema } from "server/src/database";
import type z from "zod";

export default class {
  static readonly create = createInsertSchema(schema.offers).omit({
    id: true,
    userId: true,
  });

  static readonly update = createUpdateSchema(schema.offers).omit({
    id: true,
    userId: true,
    productId: true,
  });
}
