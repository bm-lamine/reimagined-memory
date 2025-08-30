import baseSchema from "@enjoy/schema/auth/base.schema";
import cuid2 from "@paralleldrive/cuid2";
import { STATUS_CODE } from "config/codes";
import JwtConfig from "config/jwt";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { failed, hn, ok, valid } from "main/utils";
import { HashUtils, JwtUtils } from "utils/auth";

const login = hn();

login.post("/", valid("json", baseSchema.login), async (ctx) => {
  const data = ctx.req.valid("json");

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email));

  if (!user) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: ["user"],
          message: "Email not found in our records",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  } else if (!(await HashUtils.verify(data.password, user.password))) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: ["email", "password"],
          message: "Invalid credentials",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const accessToken = await JwtUtils.sign(
    {
      jti: cuid2.createId(),
      email: user.email,
      userId: user.id,
    },
    false
  );

  const refreshToken = await JwtUtils.sign(
    {
      jti: cuid2.createId(),
      email: user.email,
      userId: user.id,
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
      message: "User successfully logged in.",
      data: undefined,
      next: "/",
    })
  );
});

export default login;
