import type {
  User,
  UserCreate,
  UserSelect,
  UserUpdate,
} from "@enjoy/types/auth";
import { db, schema } from "db";
import { eq, getTableColumns, or, type SQLWrapper } from "drizzle-orm";

export default class {
  static readonly columns = getTableColumns(schema.users);

  static async query() {
    const users = await db.select().from(schema.users);
    return users;
  }

  static async queryById(id: string) {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return user;
  }

  static async create(data: UserCreate) {
    const [user] = await db.insert(schema.users).values(data).returning();
    return user;
  }

  static async update(id: string, data: UserUpdate) {
    const [user] = await db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  static async delete(id: string) {
    const [user] = await db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  static async getConflicts({ email }: Conflict) {
    const conflicts = new Set<keyof Conflict>();
    const conditions = new Array<SQLWrapper>();

    if (email) conditions.push(eq(schema.users.email, email));

    if (conditions.length === 0) {
      return conflicts; // nothing to check
    }

    const data = await db
      .select()
      .from(schema.users)
      .where(or(...conditions));

    if (data.some((u) => u.email === email)) {
      conflicts.add("email");
    }

    return conflicts;
  }

  static toJson(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

type Conflict = Pick<UserSelect, "email">;
