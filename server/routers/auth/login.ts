import baseSchema from "@enjoy/schema/auth/base.schema";
import cuid2 from "@paralleldrive/cuid2";
import { STATUS_CODE } from "config/codes";
import SessionConfig from "config/session";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { failed, hn, ok, valid } from "main/utils";
import { EmailUtils, HashUtils, JwtUtils, SessionUtils } from "utils/auth";

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
      STATUS_CODE.BAD_REQUEST,
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
      STATUS_CODE.BAD_REQUEST,
    );
  } else if (!user.emailVerifiedAt) {
    const otp = await EmailUtils.createOtp("email-verification", data.email);
    console.log(`email-verification:${data.email} otp ==> ${otp} `);

    return ctx.json({
      emailVerified: false,
      message: "email not verified, otp sent",
      next: "/auth/verify-email",
    });
  }

  const res = await SessionUtils.create(user.id);

  if (!res) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: [],
          message: "Something went wrong",
        },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR,
    );
  }

  const accessToken = await JwtUtils.sign({
    session: res.session.id,
    email: user.email,
    userId: user.id,
  });

  setCookie(ctx, SessionConfig.name, res.token, SessionConfig.cookie);

  return ctx.json({
    emailVerified: true,
    token: accessToken,
    message: "user logged in",
    next: "/",
  });
});

export default login;
