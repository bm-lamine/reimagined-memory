import { db, schema } from "#/database";
import { eq, getTableColumns } from "drizzle-orm";
import type { ProductCreate, ProductUpdate } from "shared/types/store";

export default class {
  static readonly columns = getTableColumns(schema.products);
  static readonly query = db.select().from(schema.products).$dynamic();

  static async getById(id: string) {
    const [product] = await this.query.where(eq(schema.products.id, id));
    return product ?? null;
  }

  static async getByUserId(userId: string) {
    const [product] = await this.query.where(
      eq(schema.products.userId, userId)
    );
    return product ?? null;
  }

  static async create(userId: string, data: ProductCreate) {
    const [product] = await db
      .insert(schema.products)
      .values({ userId, ...data })
      .returning();
    return product ?? null;
  }

  static async update(id: string, data: ProductUpdate) {
    const [product] = await db
      .update(schema.products)
      .set({ ...data })
      .where(eq(schema.products.id, id))
      .returning();
    return product ?? null;
  }

  static async delete(id: string) {
    const [product] = await db
      .delete(schema.products)
      .where(eq(schema.products.id, id))
      .returning();
    return product ?? null;
  }
}
