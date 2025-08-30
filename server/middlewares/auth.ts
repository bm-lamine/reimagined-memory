import env from "config/env";
import JwtConfig from "config/jwt";
import { jwt } from "hono/jwt";

export default jwt({
  secret: env.JWT_SECRET,
  cookie: JwtConfig.accessToken.name,
  alg: "HS256",
});
