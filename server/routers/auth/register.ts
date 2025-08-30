import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import userRepo from "repos/auth/user.repo";
import { failed, hn, ok, valid } from "main/utils";
import { EmailUtils } from "utils/auth";

const register = hn();

register.post("/", valid("json", baseSchema.register), async (ctx) => {
  const data = ctx.req.valid("json");
  const conflicts = await userRepo.getConflicts({ email: data.email });

  if (conflicts.has("email")) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: ["email"],
          message: "Email already used",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const user = await userRepo.create({
    name: data.name,
    email: data.email,
    password: await Bun.password.hash(data.password),
  });

  if (!user) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: [],
          message: "User registration failed",
        },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  const otp = await EmailUtils.createOtp("email-verification", user.email);
  console.log(`email-verification:${user.email} otp ==> ${otp} `);

  return ctx.json(
    ok({
      success: true,
      message: "User Registered Successfully",
      data: undefined,
      next: "/auth/verify-email",
    })
  );
});

export default register;
