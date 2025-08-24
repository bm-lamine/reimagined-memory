import { db, schema } from "#/database";
import { eq, getTableColumns } from "drizzle-orm";
import type { OfferCreate, OfferUpdate } from "shared/types/store";

export default class {
  static readonly query = db.select().from(schema.offers).$dynamic();
  static readonly columns = getTableColumns(schema.offers);

  static async getById(id: string) {
    const [offer] = await this.query.where(eq(schema.offers.id, id)).execute();
    return offer ?? null;
  }

  static async getByUserId(userId: string) {
    const offers = await this.query
      .where(eq(schema.offers.userId, userId))
      .execute();
    return offers;
  }

  static async create(userId: string, data: OfferCreate) {
    const [offer] = await db
      .insert(schema.offers)
      .values({ userId, ...data })
      .returning();
    return offer ?? null;
  }

  static async update(id: string, data: OfferUpdate) {
    const [offer] = await db
      .update(schema.offers)
      .set({ ...data })
      .where(eq(schema.offers.id, id))
      .returning();
    return offer ?? null;
  }

  static async delete(id: string) {
    const [offer] = await db
      .delete(schema.offers)
      .where(eq(schema.offers.id, id))
      .returning();
    return offer ?? null;
  }
}
