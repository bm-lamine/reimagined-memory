import { create } from "#/utils/router";

const app = create();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
