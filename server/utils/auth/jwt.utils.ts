import type { Auth } from "@enjoy/types/auth";
import env from "config/env";
import * as jwt from "hono/jwt";

export default class {
  static readonly accessToken = {
    cookieName: "access_token",
    duration: 1 * 60 * 60,
  };

  static readonly refreshToken = {
    cookieName: "refresh_token",
    duration: 7 * 24 * 60 * 60,
  };

  static async sign(auth: Auth, refresh: boolean) {
    const iat = Math.floor(Date.now() / 1000);
    const exp =
      Math.floor(Date.now() / 1000) +
      (refresh ? this.refreshToken.duration : this.accessToken.duration);
    return await jwt.sign({ ...auth, iat, exp }, env.JWT_SECRET, "HS256");
  }

  static async verify(token: string) {
    try {
      const payload = await jwt.verify(token, env.JWT_SECRET, "HS256");
      return payload as Auth;
    } catch (err) {
      return null;
    }
  }
}
