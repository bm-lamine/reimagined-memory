import { db, schema } from "#/database";
import { eq } from "drizzle-orm";
import type { Unit, UnitCreate, UnitUpdate } from "shared/types/store";

export default class {
  static readonly query = db.select().from(schema.units).$dynamic();

  static async getById(id: string): Promise<Unit | null> {
    const [unit] = await this.query
      .where(eq(schema.units.id, id))
      .limit(1)
      .execute();
    return unit ?? null;
  }

  static async create(data: UnitCreate) {
    const [unit] = await db.insert(schema.units).values(data).returning();
    return unit ?? null;
  }

  static async update(id: string, data: UnitUpdate) {
    const [unit] = await db
      .update(schema.units)
      .set(data)
      .where(eq(schema.units.id, id))
      .returning();
    return unit ?? null;
  }

  static async delete(id: string) {
    const [unit] = await db
      .delete(schema.units)
      .where(eq(schema.units.id, id))
      .returning();
    return unit ?? null;
  }
}
