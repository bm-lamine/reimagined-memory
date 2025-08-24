import { db, schema } from "#/database";
import { eq, getTableColumns } from "drizzle-orm";
import type { RequestCreate, RequestUpdate } from "shared/types/store";

export default class {
  static readonly columns = getTableColumns(schema.requests);
  static readonly query = db.select().from(schema.requests).$dynamic();

  static async gerById(id: string) {
    const data = await this.query.where(eq(schema.requests.id, id));
    return data;
  }

  static async create(userId: string, data: RequestCreate) {
    const [req] = await db
      .insert(schema.requests)
      .values({ userId, ...data })
      .returning();
    return req ?? null;
  }

  static async update(id: string, data: RequestUpdate) {
    const [req] = await db
      .update(schema.requests)
      .set({ ...data })
      .where(eq(schema.requests.id, id))
      .returning();
    return req ?? null;
  }

  static async delete(id: string) {
    const [req] = await db
      .delete(schema.requests)
      .where(eq(schema.requests.id, id))
      .returning();
    return req ?? null;
  }
}
