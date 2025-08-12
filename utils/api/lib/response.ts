import { ZodError } from "zod";
import type { $ZodIssue } from "zod/v4/core";

export function apiError(issues: $ZodIssue[]) {
  return {
    errors: new ZodError(issues).issues.map((i) => {
      return {
        path: i.path,
        message: i.message,
      };
    }),
  };
}
