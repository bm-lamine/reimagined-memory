import baseSchema from "@enjoy/schema/auth/base.schema";
import { hn, ok, valid } from "main/utils";
import { EmailUtils } from "utils/auth";

const resendEmailVerification = hn();

resendEmailVerification.post(
  "/",
  valid("json", baseSchema.resendEmailVerification),
  async (ctx) => {
    const data = ctx.req.valid("json");

    const otp = await EmailUtils.createOtp("email-verification", data.email);
    console.log(`email-verification:${data.email} otp ==> ${otp} `);

    return ctx.json(
      ok({
        success: true,
        message: "Email verification sent",
        data: undefined,
        next: "/auth/verify-email",
      })
    );
  }
);

export default resendEmailVerification;
