import { hn } from "main/utils";
import auth from "middlewares/auth";

const session = hn();

session.post("/", auth, async (ctx) => {
  return ctx.json({ data: ctx.get("jwtPayload") });
});

export default session;
