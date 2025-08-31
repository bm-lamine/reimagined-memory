import type { Auth } from "@enjoy/types/auth";
import client from "cache/redis";
import authConfig from "config/jwt";
import env from "config/env";
import * as jwt from "hono/jwt";
import otp from "otp-generator";

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
