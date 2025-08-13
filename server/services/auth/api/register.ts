import { db, schema } from "#/infrastructure/database";
import router from "#/infrastructure/router";
import { getOtp, sendMail } from "#/lib/email";
import { apiError } from "#/lib/response";
import { StatusCodes } from "#/lib/status-codes";
import { validator } from "#/middlewares/validator";
import verifications from "#/repos/auth/verifications";
import { AuthSchema } from "#/schema/auth/auth";
import { hash } from "#/services/auth/utils";
import { eq } from "drizzle-orm";

const register = router();

register.post("/", validator("json", AuthSchema.register), async (ctx) => {
  const data = ctx.req.valid("json");
  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email));

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
