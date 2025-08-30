import type { SubCreate, SubSelect, SubUpdate } from "@enjoy/types/store";
import { db, schema } from "db";
import { eq, getTableColumns, or, type SQLWrapper } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.subs);

  static async query() {
    const subs = await db.select().from(schema.subs);
    return subs;
  }

  static async queryById(id: string) {
    const [sub] = await db
      .select()
      .from(schema.subs)
      .where(eq(schema.subs.id, id))
      .limit(1);
    return sub ?? null;
  }

  static async create(data: SubCreate) {
    const [sub] = await db.insert(schema.subs).values(data).returning();
    return sub ?? null;
  }

  static async update(id: string, data: SubUpdate) {
    const [sub] = await db
      .update(schema.subs)
      .set(data)
      .where(eq(schema.subs.id, id))
      .returning();
    return sub ?? null;
  }

  static async delete(id: string) {
    const [sub] = await db
      .delete(schema.subs)
      .where(eq(schema.subs.id, id))
      .returning();
    return sub ?? null;
  }

  static async getConflicts({ name }: SubSelect) {
    const conflicts = new Set<keyof SubSelect>();
    const conditions = new Array<SQLWrapper>();

    if (name) conditions.push(eq(schema.categories.name, name));

    if (conditions.length === 0) {
      return conflicts; // nothing to check
    }

    const data = await db
      .select()
      .from(schema.categories)
      .where(or(...conditions));

    if (data.some((u) => u.name === name)) {
      conflicts.add("name");
    }

    return conflicts;
  }
}
