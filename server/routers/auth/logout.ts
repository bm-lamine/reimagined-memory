import auth from "config/auth";
import { deleteCookie } from "hono/cookie";
import { hn, ok } from "main/utils";
import { requireAuth } from "middlewares/auth";

const logout = hn();

logout.post("/", requireAuth, async (ctx) => {
  deleteCookie(ctx, auth.session.name);
  return ctx.json(
    ok({
      success: true,
      message: "user logged out",
      data: undefined,
      next: "/auth/login",
    })
  );
});

export default logout;
