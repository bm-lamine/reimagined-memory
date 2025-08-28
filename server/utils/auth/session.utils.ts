import type { Session } from "@enjoy/types/auth";
import auth from "config/auth";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

export default class {
  static randomString = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 24);

  static async hashSecret(secret: string) {
    const bytes = new TextEncoder().encode(secret);
    const buffer = await crypto.subtle.digest("SHA-256", bytes);
    return new Uint8Array(buffer);
  }

  static getToken = (id: string, secret: string) => `${id}.${secret}`;

  static async create(userId: string) {
    const id = this.randomString();
    const secret = this.randomString();
    const secretHash = await this.hashSecret(secret);

    const [session] = await db
      .insert(schema.sessions)
      .values({
        id,
        userId,
        secretHash,
      })
      .returning();

    return session
      ? {
          session,
          token: this.getToken(id, secret),
        }
      : null;
  }

  static async validate(token: string) {
    const now = new Date();
    const [id, secret] = token.split(".");
    if (!id || !secret) {
      return null;
    }

    const [result] = await db
      .select({ session: schema.sessions, user: schema.users })
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id))
      .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id));

    if (
      !result ||
      now.getTime() - result.session.createdAt.getTime() >=
        auth.session.duration * 1000
    ) {
      await db.delete(schema.sessions).where(eq(schema.sessions.id, id));
      return null;
    }

    const tokenSecretHash = await this.hashSecret(secret);
    const validSecret = crypto.timingSafeEqual(
      tokenSecretHash,
      result.session.secretHash
    );

    if (!validSecret) {
      return null;
    }

    return result;
  }

  static cast(session: Session) {
    return {
      id: session.id,
      createdAt: session.createdAt,
    };
  }
}
