import type { Session, User } from "@enjoy/types/auth";
import auth from "config/auth";
import { STATUS_CODE } from "config/codes";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import sessionUtils from "utils/auth/session.utils";

export function requireAuth() {
  return createMiddleware<{
    Variables: {
      session: Session;
      user: User;
    };
  }>(async function (ctx, next) {
    const token = getCookie(ctx, auth.session.name) ?? null;
    if (!token) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "unauthorized: missing token",
      });
    }

    const valid = await sessionUtils.validate(token);
    if (!valid) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "unauthorized: invalid token",
      });
    }

    ctx.set("session", valid.session);
    ctx.set("user", valid.user);

    return next();
  });
}
