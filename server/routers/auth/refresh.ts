import cuid2 from "@paralleldrive/cuid2";
import { STATUS_CODE } from "config/codes";
import { failed, hn, valid } from "main/utils";
import { JwtUtils } from "utils/auth";
import z from "zod";

const refresh = hn();

refresh.post(
  "/",
  valid("json", z.object({ refreshToken: z.string() })),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const valid = await JwtUtils.validate(data.refreshToken);

    if (!valid) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "Invalid Token" }]),
        STATUS_CODE.UNAUTHORIZED
      );
    }

    const accessToken = await JwtUtils.sign({
      jti: cuid2.createId(),
      email: valid.email,
      userId: valid.userId,
    });

    const refreshToken = await JwtUtils.sign(
      {
        jti: cuid2.createId(),
        email: valid.email,
        userId: valid.userId,
      },
      true
    );

    return ctx.json({ accessToken, refreshToken });
  }
);

export default refresh;
