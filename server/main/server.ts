import env from "config/env";
import { websocket } from "hono/bun";
import app from "./app";

export default {
  port: env.SERVER_PORT,
  fetch: app.fetch,
  websocket,
};
