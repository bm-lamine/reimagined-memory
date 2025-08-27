import type { ProposalCreate, ProposalUpdate } from "@enjoy/types/store";
import { db, schema } from "db";
import { eq, getTableColumns } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.proposals);

  static async query() {
    const proposals = await db.select().from(schema.proposals);
    return proposals;
  }

  static async queryById(id: string) {
    const [demand] = await db
      .select()
      .from(schema.proposals)
      .where(eq(schema.proposals.id, id))
      .limit(1);
    return demand ?? null;
  }

  static async create(data: ProposalCreate) {
    const [demand] = await db.insert(schema.proposals).values(data).returning();
    return demand ?? null;
  }

  static async update(id: string, data: ProposalUpdate) {
    const [demand] = await db
      .update(schema.proposals)
      .set(data)
      .where(eq(schema.proposals.id, id))
      .returning();
    return demand ?? null;
  }

  static async delete(id: string) {
    const [demand] = await db
      .delete(schema.proposals)
      .where(eq(schema.proposals.id, id))
      .returning();
    return demand ?? null;
  }
}
