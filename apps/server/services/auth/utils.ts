import { env } from "#/src/env";
import type { Auth } from "auth";
import { sign } from "hono/jwt";
import type { CookieOptions } from "hono/utils/cookie";

export class Jwt {
  static readonly name = "jwt_auth";
  static readonly duration = 30 * 60;
  static readonly cookie: CookieOptions | undefined = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: this.duration,
  };

  static async sign(payload: Auth) {
    return await sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + this.duration,
      },
      env.JWT_SECRET,
      "HS256"
    );
  }
}
