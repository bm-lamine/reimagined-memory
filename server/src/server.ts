import { env } from "#/config/env";
import { bootstrap } from "#/config/init";
import { websocket } from "hono/bun";
import app from "./app";

await bootstrap();

export default {
  port: env.SERVER_PORT,
  fetch: app.fetch,
  websocket,
};
