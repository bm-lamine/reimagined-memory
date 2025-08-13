import { db, schema } from "#/infrastructure/database";
import type {
  UnitCreate,
  UnitSelect,
  UnitUpdate,
} from "#/schema/store/units.schema";
import { and, eq, or } from "drizzle-orm";

export default class UnitRepo {
  static async getAll() {
    return await db.select().from(schema.units);
  }

  static async getFirst({ id, name, short, verified }: UnitSelect) {
    const [unit] = await db
      .select()
      .from(schema.units)
      .where(
        and(
          id ? eq(schema.units.id, id) : undefined,
          name ? eq(schema.units.name, name) : undefined,
          short ? eq(schema.units.short, short) : undefined,
          verified ? eq(schema.units.verified, verified) : undefined
        )
      )
      .limit(1);
    return unit ?? null;
  }

  static async getConflicts(name?: string, short?: string) {
    const conflicts = {
      name: false,
      short: false,
      pair: false,
    };

    // Single query for all matches
    const rows = await db
      .select({
        id: schema.units.id,
        name: schema.units.name,
        short: schema.units.short,
      })
      .from(schema.units)
      .where(
        or(
          name ? eq(schema.units.name, name) : undefined,
          short ? eq(schema.units.short, short) : undefined
        )
      );

    for (const row of rows) {
      if (row.name === name && row.short === short) {
        conflicts.pair = true;
      }
      if (row.name === name) {
        conflicts.name = true;
      }
      if (row.short === short) {
        conflicts.short = true;
      }
    }

    return conflicts;
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
