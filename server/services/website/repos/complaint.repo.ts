import type { ComplaintCreate, ComplaintUpdate } from "@enjoy/types/website";
import { db, schema } from "db";
import { eq, getTableColumns } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.complaints);

  static async query() {
    const complaints = await db.select().from(schema.complaints);
    return complaints;
  }

  static async queryById(id: string) {
    const [unit] = await db
      .select()
      .from(schema.complaints)
      .where(eq(schema.complaints.id, id))
      .limit(1);
    return unit;
  }

  static async create(data: ComplaintCreate) {
    const [unit] = await db.insert(schema.complaints).values(data).returning();
    return unit;
  }

  static async update(id: string, data: ComplaintUpdate) {
    const [unit] = await db
      .update(schema.complaints)
      .set(data)
      .where(eq(schema.complaints.id, id))
      .returning();
    return unit;
  }

  static async delete(id: string) {
    const [unit] = await db
      .delete(schema.complaints)
      .where(eq(schema.complaints.id, id))
      .returning();
    return unit;
  }
}
