import type { CookieOptions } from "hono/utils/cookie";

export default class {
  static readonly session: AuthConfig = {
    name: "auth_session",
    duration: 7 * 24 * 60 * 60,
    cookie: undefined,
  };

  static readonly token: AuthConfig = {
    name: "auth_token",
    duration: 60 * 60,
    cookie: undefined,
  };
}

export type AuthConfig = {
  name: string;
  duration: number;
  cookie: CookieOptions | undefined;
};
