import type { DemandCreate, DemandUpdate } from "@enjoy/types/store";
import { db, schema } from "db";
import { eq, getTableColumns } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.demands);

  static async query() {
    const demands = await db.select().from(schema.demands);
    return demands;
  }

  static async queryById(id: string) {
    const [demand] = await db
      .select()
      .from(schema.demands)
      .where(eq(schema.demands.id, id))
      .limit(1);
    return demand ?? null;
  }

  static async create(data: DemandCreate) {
    const [demand] = await db.insert(schema.demands).values(data).returning();
    return demand ?? null;
  }

  static async update(id: string, data: DemandUpdate) {
    const [demand] = await db
      .update(schema.demands)
      .set(data)
      .where(eq(schema.demands.id, id))
      .returning();
    return demand ?? null;
  }

  static async delete(id: string) {
    const [demand] = await db
      .delete(schema.demands)
      .where(eq(schema.demands.id, id))
      .returning();
    return demand ?? null;
  }

  //   static async getConflicts({ name }: DemandSelect) {
  //     const conflicts = new Set<keyof DemandSelect>();
  //     const conditions = new Array<SQLWrapper>();

  //     if (name) conditions.push(eq(schema.demands.name, name));

  //     if (conditions.length === 0) {
  //       return conflicts; // nothing to check
  //     }

  //     const data = await db
  //       .select()
  //       .from(schema.demands)
  //       .where(or(...conditions));

  //     if (data.some((u) => u.name === name)) {
  //       conflicts.add("name");
  //     }

  //     return conflicts;
  //   }
}
