import { db, schema } from "#/infrastructure/database";
import router from "#/infrastructure/router";
import verifications from "#/repos/auth/verifications";
import { apiError, StatusCodes, validator } from "api";
import { verify, VerifyEmailSchema } from "auth";
import { eq } from "drizzle-orm";

const verifyEmail = router();

verifyEmail.post(
  "/",
  validator("json", VerifyEmailSchema.verify),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const hash = await verifications.get("email-verification", data.email);

    if (!hash || !(await verify(data.otp, hash))) {
      return ctx.json(
        apiError([
          {
            code: "custom",
            path: ["otp"],
            message: "invalid or expired otp",
          },
        ]),
        StatusCodes.BAD_REQUEST
      );
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user) {
      return ctx.json(
        apiError([
          {
            code: "custom",
            path: ["otp"],
            message: "user not found",
          },
        ]),
        StatusCodes.BAD_REQUEST
      );
    } else if (user.emailVerifiedAt) {
      return ctx.json(
        apiError([
          {
            code: "custom",
            path: [],
            message: "email already verified",
          },
        ]),
        StatusCodes.BAD_REQUEST
      );
    }

    await db
      .update(schema.users)
      .set({
        emailVerifiedAt: new Date(),
      })
      .where(eq(schema.users.id, user.id));

    await verifications.invalidate("email-verification", data.email);

    return ctx.json({
      message: "email verified",
      next: "/auth/login",
    });
  }
);

export default verifyEmail;
