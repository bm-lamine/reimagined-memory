import { STATUS_CODE } from "#/config/codes";
import { failure } from "#/utils/response";
import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

export const validator = <
  T extends ZodType,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, async (result, ctx) => {
    if (!result.success) {
      return ctx.json(failure(result.error.issues), STATUS_CODE.BAD_REQUEST);
    }
  });
