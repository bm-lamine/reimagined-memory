import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { failed, hn, ok, valid } from "main/utils";
import { EmailUtils } from "utils/auth";

const verifyPasswordReset = hn();

verifyPasswordReset.post(
  "/",
  valid("json", baseSchema.verifyPasswordReset),
  async (ctx) => {
    const data = ctx.req.valid("json");

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, data.email));

    if (!user) {
      return ctx.json(
        failed([
          { code: "custom", path: ["email"], message: "User not found" },
        ]),
        STATUS_CODE.NOT_FOUND,
      );
    }

    const valid = await EmailUtils.validateOtp(
      "password-reset",
      data.email,
      data.otp,
    );

    if (!valid) {
      return ctx.json(
        failed([{ code: "custom", path: ["otp"], message: "Invalid otp" }]),
        STATUS_CODE.BAD_REQUEST,
      );
    }

    return ctx.json({
      message: "Password Reset Token Correct",
    });
  },
);

export default verifyPasswordReset;
