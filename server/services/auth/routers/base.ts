import baseSchema from "@enjoy/schema/auth/base.schema";
import { STATUS_CODE } from "config/codes";
import { failed, hn, ok, valid } from "main/utils";
import userRepo from "services/auth/repos/user.repo";

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
      data: user,
      next: "/auth/verify-email",
    })
  );
});

export default base;
