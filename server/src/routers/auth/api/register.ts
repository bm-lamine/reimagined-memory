import { STATUS_CODE } from "#/config/codes";
import { validator } from "#/middlewares/validator";
import UserRepo from "#/repos/auth/user";
import VerificationRepo from "#/repos/auth/verification";
import AuthSchema from "#/schema/auth";
import { createOtp } from "#/utils/otp";
import Password from "#/utils/password";
import { failure, success } from "#/utils/response";
import { create } from "#/utils/router";

const register = create();

register.post("/", validator("json", AuthSchema.register), async (ctx) => {
  const data = ctx.req.valid("json");

  const user = await UserRepo.findEmail(data.email);

  if (user) {
    return ctx.json(
      failure([
        {
          code: "custom",
          path: ["email"],
          message: "email already used",
        },
      ]),
      STATUS_CODE.BAD_REQUEST,
    );
  }

  await UserRepo.create({
    name: data.name,
    email: data.email,
    password: await Password.hash(data.password),
  });

  const plain = createOtp();
  const hash = await Password.hash(plain);
  void VerificationRepo.store("email-verification", data.email, hash);

  return ctx.json(
    success("registered", "/auth/verify-email", { otp: plain }),
    STATUS_CODE.OK,
  );
});

export default register;
