import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { failed, hn, ok, valid } from "main/utils";
import { EmailUtils, HashUtils, JwtUtils } from "utils/auth";

const resetPassword = hn();

resetPassword.post(
  "/",
  valid("json", baseSchema.resetPassword),
  async (ctx) => {
    const data = ctx.req.valid("json");

    const valid = await EmailUtils.validateOtp(
      "password-reset",
      data.email,
      data.otp
    );

    if (!valid) {
      return ctx.json(
        failed([{ code: "custom", path: ["otp"], message: "Invalid otp" }]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user) {
      return ctx.json(
        failed([
          { code: "custom", path: ["email"], message: "User not found" },
        ]),
        STATUS_CODE.NOT_FOUND
      );
    }

    const isSame = await HashUtils.verify(data.password, user.password);
    if (isSame) {
      return ctx.json(
        failed([
          {
            code: "custom",
            path: ["password"],
            message: "New password cannot be the same as the old one",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    await db
      .update(schema.users)
      .set({ password: await HashUtils.hash(data.password) })
      .where(eq(schema.users.id, user.id));

    await JwtUtils.invalidate(user.id, "*");

    return ctx.json(
      ok({
        success: true,
        message: "Password Reset Success",
        data: undefined,
        next: undefined,
      })
    );
  }
);

export default resetPassword;
