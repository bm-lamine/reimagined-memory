import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { schema } from "server/src/database";
import z from "zod";

export default class {
  static readonly create = createInsertSchema(schema.responses).omit({
    id: true,
  });

  static readonly update = createUpdateSchema(schema.responses).omit({
    id: true,
  });
}
