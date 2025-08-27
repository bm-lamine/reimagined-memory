import type { Auth } from "@enjoy/types/auth";
import env from "config/env";
import * as jwt from "hono/jwt";

export default class {
  static readonly name = "access_token";
  static readonly span = 2 * 60 * 60;

  static async sign(auth: Auth) {
    return await jwt.sign(
      { ...auth, exp: Math.floor(Date.now() / 1000) + this.span },
      env.DATABASE_URL,
      "HS256"
    );
  }

  static async verify(token: string) {
    try {
      const payload = await jwt.verify(token, "", "HS256");
      return payload as Auth;
    } catch (err) {
      return null;
    }
  }
}
