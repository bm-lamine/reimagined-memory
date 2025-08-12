import type { Auth } from "auth";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";

export default function () {
  return new Hono<{ Variables: JwtVariables<Auth> }>();
}
