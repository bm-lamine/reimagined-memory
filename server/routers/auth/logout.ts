import SessionConfig from "config/session";
import { deleteCookie } from "hono/cookie";
import { hn } from "main/utils";

const logout = hn();

logout.post("/", async (ctx) => {
  deleteCookie(ctx, SessionConfig.COOKIE_NAME);
  return ctx.json({ next: "/auth/login" });
});

export default logout;
