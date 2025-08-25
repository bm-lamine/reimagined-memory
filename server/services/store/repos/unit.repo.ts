import type { UnitCreate, UnitSelect, UnitUpdate } from "@enjoy/types/store";
import { db, schema } from "db";
import { eq, getTableColumns, or, type SQLWrapper } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.units);

  static async query() {
    const units = await db.select().from(schema.units);
    return units;
  }

  static async queryById(id: string) {
    const [unit] = await db
      .select()
      .from(schema.units)
      .where(eq(schema.units.id, id))
      .limit(1);
    return unit;
  }

  static async create(data: UnitCreate) {
    const [unit] = await db.insert(schema.units).values(data).returning();
    return unit;
  }

  static async update(id: string, data: UnitUpdate) {
    const [unit] = await db
      .update(schema.units)
      .set(data)
      .where(eq(schema.units.id, id))
      .returning();
    return unit;
  }

  static async delete(id: string) {
    const [unit] = await db
      .delete(schema.units)
      .where(eq(schema.units.id, id))
      .returning();
    return unit;
  }

  static async getConflicts({ name, alias }: UnitSelect) {
    const conflicts = new Set<keyof UnitSelect>();
    const conditions = new Array<SQLWrapper>();

    if (name) conditions.push(eq(schema.units.name, name));
    if (alias) conditions.push(eq(schema.units.alias, alias));

    if (conditions.length === 0) {
      return conflicts; // nothing to check
    }

    const data = await db
      .select()
      .from(schema.units)
      .where(or(...conditions));

    if (data.some((u) => u.name === name)) {
      conflicts.add("name");
    } else if (data.some((u) => u.alias === alias)) {
      conflicts.add("alias");
    }

    return conflicts;
  }
}
