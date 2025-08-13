import { schema } from "#/infrastructure/database";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

export class UnitSchema {
  static readonly select = createSelectSchema(schema.units).partial();

  static readonly create = createInsertSchema(schema.units, {
    name: z.string({ error: "name required" }),
    short: z.string({ error: "short name required" }),
  }).omit({ id: true });

  static readonly update = createUpdateSchema(schema.units).omit({ id: true });
}

export type UnitSelect = z.infer<typeof UnitSchema.select>;
export type UnitCreate = z.infer<typeof UnitSchema.create>;
export type UnitUpdate = z.infer<typeof UnitSchema.update>;
