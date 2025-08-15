import auth from "#/routers/auth";
import { create } from "#/utils/router";
import { showRoutes } from "hono/dev";

const app = create();

app.route("/auth", auth);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

showRoutes(app);

export default app;
