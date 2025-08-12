import { db, schema } from "#/infrastructure/database";
import router from "#/infrastructure/router";
import { Jwt } from "#/services/auth/utils";
import { apiError, StatusCodes, validator } from "api";
import { AuthSchema, verify } from "auth";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";

const login = router();

login.post("/", validator("json", AuthSchema.login), async (ctx) => {
  const data = ctx.req.valid("json");

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, data.email));

  if (!user) {
    return ctx.json(
      apiError([
        {
          code: "custom",
          path: ["email"],
          message: "email not found in our records",
        },
      ]),
      StatusCodes.BAD_REQUEST
    );
  } else if (!(await verify(data.password, user.password))) {
    return ctx.json(
      apiError([
        {
          code: "custom",
          path: ["password"],
          message: "invalid credentials",
        },
      ]),
      StatusCodes.BAD_REQUEST
    );
  } else if (!user.emailVerifiedAt) {
    return ctx.json(
      apiError([
        {
          code: "custom",
          path: ["email"],
          message: "email not verified",
        },
      ]),
      StatusCodes.BAD_REQUEST
    );
  }

  const token = await Jwt.sign({
    userId: user.id,
    email: user.email,
    verified: Boolean(user.emailVerifiedAt),
  });

  setCookie(ctx, Jwt.name, token);

  return ctx.json({
    message: "user logged in",
    next: "/",
  });
});

export default login;
