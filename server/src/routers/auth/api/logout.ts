import { STATUS_CODE } from "#/config/codes";
import { requireAuth } from "#/middlewares/require-auth";
import Jwt from "#/utils/jwt";
import { success } from "#/utils/response";
import { create } from "#/utils/router";
import { deleteCookie } from "hono/cookie";

const logout = create();

logout.post("/", requireAuth, async (ctx) => {
  deleteCookie(ctx, Jwt.name);
  return ctx.json(success("logged out", "/auth/login"), STATUS_CODE.OK);
});

export default logout;
