import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { failed, hn, ok, valid } from "main/utils";
import passwordUtils from "utils/auth/password.utils";

const login = hn();

login.post("/", valid("json", baseSchema.login), async (ctx) => {
  const data = ctx.req.valid("json");
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email));

  if (!user) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "user not found" }]),
      STATUS_CODE.BAD_REQUEST
    );
  } else if (!(await passwordUtils.verify(data.password, user.password))) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "invalid credentials" }]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "user logged",
      data: {},
      next: "/",
    })
  );
});

export default login;
