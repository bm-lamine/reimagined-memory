import { STATUS_CODE } from "#/config/codes";
import { requireAuth } from "#/middlewares/require-auth";
import UserRepo from "#/repos/auth/user";
import Jwt from "#/utils/jwt";
import { success } from "#/utils/response";
import { create } from "#/utils/router";
import { deleteCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

const getSession = create();

getSession.post("/", requireAuth, async (ctx) => {
  const data = ctx.get("jwtPayload");
  const user = await UserRepo.findId(data.id);

  if (!user) {
    deleteCookie(ctx, Jwt.name);
    throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
      message: "Jwt Token Invalid",
    });
  }

  return ctx.json(
    success("session valid", undefined, {
      data,
    })
  );
});

export default getSession;
