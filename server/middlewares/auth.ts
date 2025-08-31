import env from "config/env";
import { jwt } from "hono/jwt";

export default jwt({
  secret: env.JWT_SECRET,
  alg: "HS256",
});
