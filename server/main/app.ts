import env from "config/env";
import { websocket } from "hono/bun";
import { hn } from "main/utils";

const app = hn();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: env.SERVER_PORT,
  fetch: app.fetch,
  websocket,
};
