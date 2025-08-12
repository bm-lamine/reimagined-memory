import { Hono } from "hono";
import { hello } from "schema";

const app = new Hono();

app.get("/", (c) => {
  return c.text(hello);
});

export default app;
