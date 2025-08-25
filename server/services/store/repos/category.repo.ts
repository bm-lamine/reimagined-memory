import type {
  CategoryCreate,
  CategorySelect,
  CategoryUpdate,
} from "@enjoy/types/store";
import { db, schema } from "db";
import { eq, getTableColumns, or, type SQLWrapper } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.categories);

  static async query() {
    const categories = await db.select().from(schema.categories);
    return categories;
  }

  static async queryById(id: string) {
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id))
      .limit(1);
    return category;
  }

  static async create(data: CategoryCreate) {
    const [category] = await db
      .insert(schema.categories)
      .values(data)
      .returning();
    return category;
  }

  static async update(id: string, data: CategoryUpdate) {
    const [category] = await db
      .update(schema.categories)
      .set(data)
      .where(eq(schema.categories.id, id))
      .returning();
    return category;
  }

  static async delete(id: string) {
    const [category] = await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id))
      .returning();
    return category;
  }

  static async getConflicts({ name }: CategorySelect) {
    const conflicts = new Set<keyof CategorySelect>();
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
