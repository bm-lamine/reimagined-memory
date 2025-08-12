import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { ZodType } from "zod";
import { apiError } from "./lib/response";
import { StatusCodes } from "./lib/status-codes";

const validator = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, async (result, ctx) => {
    if (!result.success) {
      return ctx.json(apiError(result.error.issues), StatusCodes.BAD_REQUEST);
    }
  });

export { validator, apiError, StatusCodes };
