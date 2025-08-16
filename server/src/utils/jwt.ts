import { env } from "#/config/env";
import { sign } from "hono/jwt";
import type { CookieOptions } from "hono/utils/cookie";
import type { Auth } from "shared/types/auth";

export default class Jwt {
  static readonly name = "auth_token";
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
