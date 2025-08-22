import auth from "#/routers/auth";
import store from "#/routers/store";
import { create } from "#/utils/router";
import * as dev from "hono/dev";

const app = create();

app.route("/auth", auth);
app.route("/store", store);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

dev.showRoutes(app);

export default app;
