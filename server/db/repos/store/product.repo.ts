import type {
  ProductCreate,
  ProductSelect,
  ProductUpdate,
} from "@enjoy/types/store";
import { db, schema } from "db";
import { eq, getTableColumns, or, type SQLWrapper } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.products);

  static async query() {
    const products = await db.select().from(schema.products);
    return products;
  }

  static async queryById(id: string) {
    const [Product] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, id))
      .limit(1);
    return Product;
  }

  static async create(data: ProductCreate) {
    const [Product] = await db.insert(schema.products).values(data).returning();
    return Product;
  }

  static async update(id: string, data: ProductUpdate) {
    const [Product] = await db
      .update(schema.products)
      .set(data)
      .where(eq(schema.products.id, id))
      .returning();
    return Product;
  }

  static async delete(id: string) {
    const [Product] = await db
      .delete(schema.products)
      .where(eq(schema.products.id, id))
      .returning();
    return Product;
  }

  //   static async getConflicts({ name }: ProductSelect) {
  //     const conflicts = new Set<keyof ProductSelect>();
  //     const conditions = new Array<SQLWrapper>();

  //     if (name) conditions.push(eq(schema.products.name, name));

  //     if (conditions.length === 0) {
  //       return conflicts; // nothing to check
  //     }

  //     const data = await db
  //       .select()
  //       .from(schema.products)
  //       .where(or(...conditions));

  //     if (data.some((u) => u.name === name)) {
  //       conflicts.add("name");
  //     }

  //     return conflicts;
  //   }
}
