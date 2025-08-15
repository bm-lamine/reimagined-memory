import { env } from "#/config/env";
import Jwt from "#/utils/jwt";
import { jwt } from "hono/jwt";

export const requireAuth = jwt({
  secret: env.JWT_SECRET,
  cookie: Jwt.name,
  alg: "HS256",
});
