import { STATUS_CODE } from "#/config/codes";
import { db, schema } from "#/database";
import { validator } from "#/middlewares/validator";
import VerificationRepo from "#/repos/auth/verification";
import VerifyEmailSchema from "#/schema/auth/verification";
import Password from "#/utils/password";
import { failure, success } from "#/utils/response";
import { create } from "#/utils/router";
import { eq } from "drizzle-orm";

const verifyEmail = create();

verifyEmail.post(
  "/",
  validator("json", VerifyEmailSchema.verify),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const hash = await VerificationRepo.get("email-verification", data.email);

    if (!hash || !(await Password.verify(data.otp, hash))) {
      return ctx.json(
        failure([
          {
            code: "custom",
            path: ["otp"],
            message: "invalid or expired otp",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user) {
      return ctx.json(
        failure([
          {
            code: "custom",
            path: ["otp"],
            message: "user not found",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    } else if (user.emailVerifiedAt) {
      return ctx.json(
        failure([
          {
            code: "custom",
            path: [],
            message: "email already verified",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    await db
      .update(schema.users)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(schema.users.id, user.id));

    void VerificationRepo.invalidate("email-verification", data.email);

    return ctx.json(success("email verified", "/auth/login"));
  }
);

export default verifyEmail;
