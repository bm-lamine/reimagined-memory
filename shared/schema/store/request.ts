import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { schema } from "server/src/database";

export default class RequestSchema {
  static readonly create = createInsertSchema(schema.requests).omit({
    id: true,
    userId: true,
  });

  static readonly update = createUpdateSchema(schema.requests).omit({
    id: true,
    userId: true,
  });
}
