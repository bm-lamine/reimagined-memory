import env from "config/env";
import { jwt } from "hono/jwt";
import jwtUtils from "utils/auth/jwt.utils";

export const requireAuth = jwt({
  secret: env.JWT_SECRET,
  cookie: jwtUtils.accessToken.cookieName,
  alg: "HS256",
});
