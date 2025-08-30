import { STATUS_CODE } from "config/codes";
import JwtConfig from "config/jwt";
import { deleteCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { hn, ok, valid } from "main/utils";
import { JwtUtils } from "utils/auth";
import z from "zod";

const logout = hn();

logout.post(
  "/",
  valid(
    "cookie",
    z.object({
      refresh_token: z.string({ error: "refresh token required" }),
    })
  ),
  async (ctx) => {
    const data = ctx.req.valid("cookie");
    const payload = await JwtUtils.verify(data.refresh_token);

    if (!payload) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "invalid token",
      });
    }

    deleteCookie(ctx, JwtConfig.accessToken.name);
    deleteCookie(ctx, JwtConfig.refreshToken.name);

    await JwtUtils.invalidate(payload.userId, payload.jti);

    return ctx.json(
      ok({
        success: true,
        message: "user logged out",
        data: undefined,
        next: "/auth/login",
      })
    );
  }
);

export default logout;
