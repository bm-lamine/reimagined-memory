import baseSchema from "@enjoy/schema/auth/base.schema";
import auth from "config/auth";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { failed, hn, ok, valid } from "main/utils";
import passwordUtils from "utils/auth/password.utils";
import sessionUtils from "utils/auth/session.utils";

const login = hn();

login.post("/", valid("json", baseSchema.login), async (ctx) => {
  const data = ctx.req.valid("json");
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email));

  if (!user) {
    return ctx.json(
      failed([{ code: "custom", path: ["email"], message: "user not found" }]),
      STATUS_CODE.BAD_REQUEST
    );
  } else if (!(await passwordUtils.verify(data.password, user.password))) {
    return ctx.json(
      failed([
        { code: "custom", path: ["email"], message: "invalid credentials" },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const res = await sessionUtils.create(user.id);

  if (!res) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "internal server error" }]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  setCookie(ctx, auth.session.name, res.token, auth.session.cookie);

  return ctx.json(
    ok({
      success: true,
      message: "user logged",
      data: { session: res.token },
      next: "/",
    })
  );
});

export default login;
