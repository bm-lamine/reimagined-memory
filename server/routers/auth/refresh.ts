import { STATUS_CODE } from "config/codes";
import JwtConfig from "config/jwt";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { hn, ok, valid } from "main/utils";
import { nanoid } from "nanoid";
import { JwtUtils } from "utils/auth";
import z from "zod";

const refresh = hn();

refresh.post(
  "/",
  valid("cookie", z.object({ refresh_token: z.string() })),
  async (ctx) => {
    const data = ctx.req.valid("cookie");
    const valid = await JwtUtils.validate(data.refresh_token);

    if (!valid) {
      throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
        message: "invalid token",
      });
    }

    const accessToken = await JwtUtils.sign({
      jti: nanoid(),
      email: valid.email,
      userId: valid.userId,
    });

    const refreshToken = await JwtUtils.sign(
      {
        jti: nanoid(),
        email: valid.email,
        userId: valid.userId,
      },
      true
    );

    setCookie(
      ctx,
      JwtConfig.accessToken.name,
      accessToken,
      JwtConfig.accessToken.cookie
    );

    setCookie(
      ctx,
      JwtConfig.refreshToken.name,
      refreshToken,
      JwtConfig.refreshToken.cookie
    );

    return ctx.json(
      ok({
        success: true,
        message: "token refreshed",
        data: undefined,
        next: undefined,
      })
    );
  }
);

export default refresh;
