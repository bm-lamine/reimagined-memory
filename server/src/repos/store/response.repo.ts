import { db, schema } from "#/database";
import { eq, getTableColumns } from "drizzle-orm";
import type { ResponseCreate, ResponseUpdate } from "shared/types/store";

export default class {
  static readonly columns = getTableColumns(schema.responses);
  static readonly query = db.select().from(schema.responses).$dynamic();

  static async getById(id: string) {
    const [response] = await this.query.where(eq(schema.responses.id, id));
    return response ?? null;
  }

  static async create(data: ResponseCreate) {
    const [res] = await db.insert(schema.responses).values(data).returning();
    return res ?? null;
  }

  static async update(id: string, data: ResponseUpdate) {
    const [res] = await db
      .update(schema.responses)
      .set(data)
      .where(eq(schema.responses.id, id))
      .returning();
    return res ?? null;
  }

  static async delete(id: string) {
    const [res] = await db
      .delete(schema.responses)
      .where(eq(schema.responses.id, id))
      .returning();
    return res ?? null;
  }
}
