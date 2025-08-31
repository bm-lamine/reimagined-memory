import baseSchema from "@enjoy/schema/auth/base.schema";
import cuid2 from "@paralleldrive/cuid2";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { failed, hn, ok, valid } from "main/utils";
import { EmailUtils, HashUtils, JwtUtils } from "utils/auth";

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
  } else if (!user.emailVerifiedAt) {
    const otp = await EmailUtils.createOtp("email-verification", data.email);
    console.log(`email-verification:${data.email} otp ==> ${otp} `);

    return ctx.json({
      message: "email not verified, otp sent",
      next: "/auth/verify-email",
    });
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

  return ctx.json({
    accessToken,
    refreshToken,
    message: "user logged in",
    next: "/",
  });
});

export default login;
