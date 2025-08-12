import router from "#/infrastructure/router";
import verifications from "#/repos/auth/verifications";
import { validator } from "api";
import { hash, VerifyEmailSchema } from "auth";
import { getOtp, sendMail } from "email";

const resendVerification = router();

resendVerification.post(
  "/",
  validator("json", VerifyEmailSchema.resend),
  async (ctx) => {
    const data = ctx.req.valid("json");

    const otp = getOtp();
    const otpHash = await hash(otp);

    await verifications.invalidate("email-verification", data.email);
    await verifications.store("email-verification", data.email, otpHash);

    await sendMail({
      to: data.email,
      subject: "Email Verification",
      html: `your otp is ${otp}`,
    });

    return ctx.json({
      message: "verification email sent",
      next: null,
    });
  }
);

export default resendVerification;
