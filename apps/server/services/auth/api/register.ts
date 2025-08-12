import { db, schema } from "#/infrastructure/database";
import router from "#/infrastructure/router";
import verifications from "#/repos/auth/verifications";
import { apiError, StatusCodes, validator } from "api";
import { AuthSchema, hash } from "auth";
import { getOtp, sendMail } from "email";

const register = router();

register.post("/", validator("json", AuthSchema.register), async (ctx) => {
  const data = ctx.req.valid("json");
  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, data.email),
  });

  if (existing) {
    return ctx.json(
      apiError([
        {
          code: "custom",
          path: ["email"],
          message: "email already used",
        },
      ]),
      StatusCodes.BAD_REQUEST
    );
  }

  await db.insert(schema.users).values({
    email: data.email,
    name: data.name,
    password: await hash(data.password),
  });

  const otp = getOtp();
  const otpHash = await hash(otp);

  await verifications.store("email-verification", data.email, otpHash);

  void sendMail({
    to: data.email,
    subject: "Email Verification",
    html: `<p>your otp is ${otp}</p>`,
  });

  return ctx.json({
    message: "account created",
    next: "/auth/verify-email",
  });
});

export default register;
