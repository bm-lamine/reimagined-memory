import type { User } from "@enjoy/types/auth";
import { STATUS_CODE } from "config/codes";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import userRepo from "db/repos/auth/user.repo";
import jwtUtils from "utils/auth/jwt.utils";

export const requireAuth = createMiddleware<{ Variables: { user: User } }>(
  async function (ctx, next) {
    const accessToken = ctx.req.header("Authorization")
      ? ctx.req.header("Authorization")?.split(" ")[1]
      : getCookie(ctx, jwtUtils.accessToken.cookieName) ?? undefined;

    if (!accessToken) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "missing access token",
      });
    }

    const payload = await jwtUtils.verify(accessToken);
    if (!payload) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "invalid access token",
      });
    }

    const user = await userRepo.queryById(payload.userId);
    if (!user || !user.isActive) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "invalid access token",
      });
    }

    ctx.set("user", user);
    return next();
  }
);
