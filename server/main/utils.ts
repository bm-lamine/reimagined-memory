import type { Auth } from "@enjoy/types/auth";
import { zValidator } from "@hono/zod-validator";
import { STATUS_CODE } from "config/codes";
import { Hono, type ValidationTargets } from "hono";
import type { JwtVariables } from "hono/jwt";
import { ZodError, ZodType } from "zod";
import type { $ZodIssue } from "zod/v4/core";

export const hn = () => new Hono<{ Variables: JwtVariables<Auth> }>();

export const ok = (res: {
  success: boolean;
  message: string;
  data: any | undefined;
  next: string | undefined;
}) => res;

export const failed = (issues: Array<$ZodIssue>) => {
  return {
    errors: new ZodError(issues).issues.map((issue) => {
      return {
        code: issue.code,
        path: issue.path,
        message: issue.message,
      };
    }),
  };
};

export const valid = <
  T extends ZodType,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zValidator(target, schema, async (result, ctx) => {
    if (!result.success) {
      return ctx.json(failed(result.error.issues), STATUS_CODE.BAD_REQUEST);
    }
  });
