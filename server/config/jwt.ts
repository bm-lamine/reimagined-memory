import type { CookieOptions } from "hono/utils/cookie";

export default class JwtConfig {
  static readonly accessToken = {
    name: "access_token",
    expiresIn: 15 * 60,
    cookie: undefined,
  };

  static readonly refreshToken = {
    name: "refresh_token",
    expiresIn: 60 * 60 * 24 * 7,
    cookie: undefined,
  };
}
