import { apiError } from "#/lib/response";
import { StatusCodes } from "#/lib/status-codes";
import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

export const validator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, async (result, ctx) => {
    if (!result.success) {
      return ctx.json(apiError(result.error.issues), StatusCodes.BAD_REQUEST);
    }
  });
