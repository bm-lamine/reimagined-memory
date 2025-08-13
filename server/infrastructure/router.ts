import type { Auth } from "#/services/auth/utils";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

export default function () {
  return new Hono<{ Variables: JwtVariables<Auth> }>();
}
