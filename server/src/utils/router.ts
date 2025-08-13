import type { Auth } from "#/types/auth";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

export function create() {
  return new Hono<{ Variables: JwtVariables<Auth> }>();
}
