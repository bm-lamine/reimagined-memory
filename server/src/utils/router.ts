import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import type { Auth } from "shared/types/auth";

export function create() {
  return new Hono<{ Variables: JwtVariables<Auth> }>();
}
