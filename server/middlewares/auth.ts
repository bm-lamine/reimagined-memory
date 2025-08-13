import { Jwt } from "#/services/auth/utils";
import { env } from "#/src/env";
import { jwt as middleware } from "hono/jwt";

export const requireAuth = middleware({
  secret: env.JWT_SECRET,
  cookie: Jwt.name,
});
