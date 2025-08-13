import { ZodError } from "zod";
import type { $ZodIssue } from "zod/v4/core";

export function success(message: string, data?: any) {
  return {
    success: true,
    status: 200,
    message,
    data,
  };
}

export function failure(issues: Array<$ZodIssue>) {
  return {
    errors: new ZodError(issues).issues.map((issue) => {
      return {
        code: issue.code,
        path: issue.path,
        message: issue.message,
      };
    }),
  };
}
