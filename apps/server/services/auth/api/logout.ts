import router from "#/infrastructure/router";
import { requireAuth } from "#/middlewares/auth";
import { Jwt } from "#/services/auth/utils";
import { deleteCookie } from "hono/cookie";

const logout = router();

logout.post("/", requireAuth, async (ctx) => {
  deleteCookie(ctx, Jwt.name);
  return ctx.json({
    message: "user logged out",
    next: "/auth/login",
  });
});

export default logout;
