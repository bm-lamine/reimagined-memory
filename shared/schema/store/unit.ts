import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { schema } from "server/src/database";

export default class UnitSchema {
  static readonly create = createInsertSchema(schema.units).omit({ id: true });
  static readonly update = createUpdateSchema(schema.units).omit({ id: true });
}
