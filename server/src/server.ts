import { env } from "#/config/env";
import { create } from "#/utils/router";
import { websocket } from "hono/bun";

const server = create();

server.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: env.SERVER_PORT,
  fetch: server.fetch,
  websocket,
};
