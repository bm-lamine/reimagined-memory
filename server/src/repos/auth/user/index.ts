import { db, schema } from "#/database";
import type { CreateUser, UpdateUser, User } from "#/types/user";
import { eq, getTableColumns } from "drizzle-orm";

export default class UserRepo {
  static async findAll(): Promise<Array<Omit<User, "password">>> {
    const { password, ...columns } = getTableColumns(schema.users);
    const users = await db.select({ ...columns }).from(schema.users);
    return users;
  }

  static async findId(id: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return user ?? null;
  }

  static async findEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return user ?? null;
  }

  static async create(data: CreateUser): Promise<User | null> {
    const [user] = await db.insert(schema.users).values(data).returning();
    return user ?? null;
  }

  static async update(id: string, data: UpdateUser): Promise<User | null> {
    const [user] = await db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, id))
      .returning();
    return user ?? null;
  }

  static async delete(id: string) {
    const [user] = await db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();
    return user ?? null;
  }
}
