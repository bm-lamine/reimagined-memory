import { STATUS_CODE } from "#/config/codes";
import { validator } from "#/middlewares/validator";
import VerificationRepo from "#/repos/auth/verification";
import VerifyEmailSchema from "#/schema/auth/verification";
import { createOtp } from "#/utils/otp";
import Password from "#/utils/password";
import { success } from "#/utils/response";
import { create } from "#/utils/router";

const resendVerification = create();

resendVerification.post(
  "/",
  validator("json", VerifyEmailSchema.resend),
  async (ctx) => {
    const data = ctx.req.valid("json");

    const plain = createOtp();
    const hash = await Password.hash(plain);

    void VerificationRepo.store("email-verification", data.email, hash);

    return ctx.json(
      success("verification mail sent", undefined, { otp: plain }),
      STATUS_CODE.OK
    );
  }
);

export default resendVerification;
