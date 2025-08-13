import router from "#/infrastructure/router";
import { requireAuth } from "#/middlewares/auth";

const session = router();

session.post("/", requireAuth, async (ctx) => {
  const data = ctx.get("jwtPayload");

  return ctx.json({
    message: "user session",
    data,
  });
});

export default session;
