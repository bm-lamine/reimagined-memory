import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { db, schema } from "db";
import userRepo from "db/repos/auth/user.repo";
import { eq } from "drizzle-orm";
import { failed, hn, ok, valid } from "main/utils";
import { requireAuth } from "middlewares/auth";
import jwtUtils from "utils/auth/jwt.utils";
import passwordUtils from "utils/auth/password.utils";

const base = hn();

base.post("/register", valid("json", baseSchema.register), async (ctx) => {
  const data = ctx.req.valid("json");
  const conflicts = await userRepo.getConflicts({ email: data.email });

  if (conflicts.has("email")) {
    return ctx.json(
      failed([
        { code: "custom", path: ["email"], message: "email already used" },
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
        { code: "custom", path: [], message: "user registration failed" },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "user registered",
      data: undefined,
      next: "/auth/verify-email",
    })
  );
});

base.post("/login", valid("json", baseSchema.login), async (ctx) => {
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

  const accessToken = await jwtUtils.sign(
    { userId: user.email, email: user.email },
    false
  );

  const refreshToken = await jwtUtils.sign(
    { userId: user.email, email: user.email },
    true
  );

  await db.insert(schema.tokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + jwtUtils.refreshToken.duration * 1000),
  });

  return ctx.json(
    ok({
      success: true,
      message: "user registered",
      data: {
        user: userRepo.toJson(user),
        accessToken,
        refreshToken,
      },
      next: "/auth/verify-email",
    })
  );
});

base.post("/logout", requireAuth, async (ctx) => {});

export default base;
