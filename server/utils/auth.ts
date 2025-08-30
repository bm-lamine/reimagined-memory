import type { Auth } from "@enjoy/types/auth";
import client from "cache/redis";
import authConfig from "config/jwt";
import env from "config/env";
import * as jwt from "hono/jwt";

export class JwtUtils {
  static key = (userId: string, jti: string) => `token:${userId}:${jti}`;

  static async sign(auth: Auth, refresh?: boolean) {
    const now = Math.floor(Date.now() / 1000);

    const expiresIn = refresh
      ? authConfig.refreshToken.expiresIn
      : authConfig.accessToken.expiresIn;

    const exp = now + expiresIn;

    const token = await jwt.sign({ ...auth, exp }, env.JWT_SECRET, "HS256");

    if (refresh) {
      // Store by jti (or full token if you prefer)
      await client.setEx(this.key(auth.userId, auth.jti), expiresIn, token);
    }

    return token;
  }

  static async verify(token: string) {
    try {
      const payload = (await jwt.verify(token, env.JWT_SECRET)) as Auth;
      return payload;
    } catch (error) {
      return null;
    }
  }

  static async validate(token: string) {
    const payload = await this.verify(token);
    if (!payload) return null;

    const stored = await client.get(this.key(payload.userId, payload.jti));
    if (stored !== token) return null;

    return payload;
  }

  static async invalidate(userId: string, jti: string) {
    return await client.del(this.key(userId, jti));
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
