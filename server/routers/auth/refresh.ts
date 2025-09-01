import { STATUS_CODE } from "config/codes";
import SessionConfig from "config/session";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { hn } from "main/utils";
import { JwtUtils, SessionUtils } from "utils/auth";

const refresh = hn();

refresh.post("/", async (ctx) => {
  const token = getCookie(ctx, SessionConfig.name);
  if (!token) {
    throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
      message: "No session token found",
    });
  }

  // 2. Validate + rotate session
  const res = await SessionUtils.validateToken(token);
  if (!res) {
    throw new HTTPException(STATUS_CODE.UNAUTHORIZED, {
      message: "Invalid or expired session",
    });
  }

  const newToken = await JwtUtils.sign({
    session: res.session.id,
    email: res.user.email,
    userId: res.user.id,
  });

  if (res.token !== token) {
    setCookie(
      ctx,
      SessionConfig.COOKIE_NAME,
      res.token,
      SessionConfig.COOKIE_OPTIONS,
    );
  }

  return ctx.json({ token: newToken });
});

export default refresh;
