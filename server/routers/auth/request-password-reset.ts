import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { failed, hn, ok, valid } from "main/utils";
import { EmailUtils } from "utils/auth";

const requestPasswordReset = hn();

requestPasswordReset.post(
  "/",
  valid("json", baseSchema.requestPasswordReset),
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
        STATUS_CODE.NOT_FOUND
      );
    }

    const otp = await EmailUtils.createOtp("password-reset", data.email);
    console.log(`password-reset:${data.email} otp ==> ${otp} `);

    return ctx.json(
      ok({
        success: true,
        message: "Password reset sent",
        data: undefined,
        next: "/auth/reset-password",
      })
    );
  }
);

export default requestPasswordReset;
