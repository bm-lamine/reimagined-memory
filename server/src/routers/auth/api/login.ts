import { STATUS_CODE } from "#/config/codes";
import { validator } from "#/middlewares/validator";
import UserRepo from "#/repos/auth/user";
import Jwt from "#/utils/jwt";
import Password from "#/utils/password";
import { failure, success } from "#/utils/response";
import { create } from "#/utils/router";
import { setCookie } from "hono/cookie";
import AuthSchema from "shared/schema/auth";

const login = create();

login.post("/", validator("json", AuthSchema.login), async (ctx) => {
  const data = ctx.req.valid("json");

  const user = await UserRepo.findEmail(data.email);

  if (!user) {
    return ctx.json(
      failure([
        {
          code: "custom",
          path: ["email"],
          message: "email not found in our records",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  } else if (!(await Password.verify(data.password, user.password))) {
    return ctx.json(
      failure([
        {
          code: "custom",
          path: ["password"],
          message: "invalid credentials",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  } else if (!user.emailVerifiedAt) {
    return ctx.json(
      failure([
        {
          code: "custom",
          path: ["email"],
          message: "email not verified",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const token = await Jwt.sign({
    id: user.id,
    email: user.email,
  });

  setCookie(ctx, Jwt.name, token);

  return ctx.json(success("logged in", "/", { token }), STATUS_CODE.OK);
});

export default login;
