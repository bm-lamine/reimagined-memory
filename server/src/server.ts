import { env } from "#/src/config/env";
import { bootstrap } from "#/src/config/init";
import { websocket } from "hono/bun";
import app from "./app";

await bootstrap();

export default {
  port: env.SERVER_PORT,
  fetch: app.fetch,
  websocket,
};
