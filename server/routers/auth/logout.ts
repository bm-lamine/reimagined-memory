import { hn, ok } from "main/utils";
import { requireAuth } from "middlewares/auth";

const logout = hn();

logout.post("/", requireAuth, async (ctx) => {
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
