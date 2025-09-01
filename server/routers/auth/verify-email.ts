import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { failed, hn, valid } from "main/utils";
import { EmailUtils } from "utils/auth";

const verifyEmail = hn();

verifyEmail.post("/", valid("json", baseSchema.verifyEmail), async (ctx) => {
  const now = new Date();
  const data = ctx.req.valid("json");

  const valid = await EmailUtils.validateOtp(
    "email-verification",
    data.email,
    data.otp,
  );

  if (!valid) {
    return ctx.json(
      failed([{ code: "custom", path: ["otp"], message: "Invalid otp" }]),
      STATUS_CODE.BAD_REQUEST,
    );
  }

  await db
    .update(schema.users)
    .set({ emailVerifiedAt: now })
    .where(eq(schema.users.email, data.email));

  return ctx.json({
    message: "Email Verified",
    next: "/auth/login",
  });
});

export default verifyEmail;
