import { schema } from "@enjoy/server/db";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export default class {
  static readonly create = createInsertSchema(schema.complaints).omit({
    id: true,
  });

  static readonly update = createUpdateSchema(schema.complaints).omit({
    id: true,
  });
}
