import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { schema } from "server/src/database";

export default class {
  static readonly create = createInsertSchema(schema.requests).omit({
    id: true,
    userId: true,
  });

  static readonly update = createUpdateSchema(schema.requests).omit({
    id: true,
    userId: true,
  });
}
