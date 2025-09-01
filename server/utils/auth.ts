import type { Auth } from "@enjoy/types/auth";
import client from "cache/redis";
import env from "config/env";
import JwtConfig from "config/jwt";
import SessionConfig from "config/session";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import * as jwt from "hono/jwt";
import * as nanoid from "nanoid";
import otp from "otp-generator";

export class JwtUtils {
  static key = (userId: string, jti: string) => `token:${userId}:${jti}`;

  static async sign(auth: Auth) {
    return await jwt.sign(
      { ...auth, exp: Math.floor(Date.now() / 1000) + JwtConfig.expiresIn },
      env.JWT_SECRET,
      "HS256"
    );
  }
}

export class SessionUtils {
  static generateSecureRandomString = nanoid.customAlphabet(
    "abcdefghijkmnpqrstuvwxyz23456789",
    24
  );

  static async hashSecret(secret: string) {
    const bytes = new TextEncoder().encode(secret);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return new Uint8Array(hashBuffer);
  }

  static async create(userId: string) {
    const now = new Date();

    const id = this.generateSecureRandomString();
    const secret = this.generateSecureRandomString();
    const secretHash = await this.hashSecret(secret);

    const token = `${id}.${secret}`;

    const [session] = await db
      .insert(schema.sessions)
      .values({ id, secretHash, userId })
      .returning();

    if (!session) return null;

    return { session, token };
  }

  static async get(id: string) {
    const now = new Date();
    const [res] = await db
      .select({ session: schema.sessions, user: schema.users })
      .from(schema.sessions)
      .where(eq(schema.sessions.id, id))
      .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId));

    if (!res) return null;

    if (
      now.getTime() - res.session.createdAt.getTime() >=
      SessionConfig.expiresIn * 1000
    ) {
      await this.delete(id);
      return null;
    }

    return res;
  }

  static async validateToken(token: string) {
    const [id, secret] = token.split(".");
    if (!id || !secret) return null;

    const res = await this.get(id);
    if (!res) return null;

    const tokenSecretHash = await this.hashSecret(secret);
    const validSecret = await crypto.timingSafeEqual(
      tokenSecretHash,
      res.session.secretHash
    );

    if (!validSecret) return null;

    const newSecret = this.generateSecureRandomString();
    const newSecretHash = await this.hashSecret(newSecret);

    const [newSession] = await db
      .update(schema.sessions)
      .set({ secretHash: newSecretHash })
      .where(eq(schema.sessions.id, id))
      .returning();

    if (!newSession) {
      console.warn(`⚠️ Rotation failed for session ${id}`);
      return {
        session: res.session,
        user: res.user,
        token,
      };
    }

    return {
      user: res.user,
      session: newSession,
      token: `${id}.${newSecret}`,
    };
  }

  static async delete(id: string) {
    return await db
      .delete(schema.sessions)
      .where(eq(schema.sessions.id, id))
      .returning();
  }
}

export class HashUtils {
  static async hash(p: string) {
    return await Bun.password.hash(p);
  }

  static async verify(p: string, h: string) {
    return await Bun.password.verify(p, h);
  }
}

export class EmailUtils {
  static generateOtp = (length?: number) => otp.generate(length ?? 6);

  static async createOtp(prefix: OtpPrefix, email: string) {
    const otp = this.generateOtp();
    const hash = await HashUtils.hash(otp);
    await client.setEx(`${prefix}:${email}`, 5 * 60, hash);
    return otp;
  }

  static async validateOtp(
    prefix: OtpPrefix,
    email: string,
    otp: string,
    del = true
  ) {
    const hash = await client.get(`${prefix}:${email}`);

    if (!hash) return false;

    const isValid = await HashUtils.verify(otp, hash);

    if (isValid && del) {
      await this.deleteOtp(prefix, email);
    }

    return true;
  }

  static async deleteOtp(prefix: OtpPrefix, email: string) {
    await client.del(`${prefix}:${email}`);
  }
}

export type OtpPrefix = "email-verification" | "password-reset";
