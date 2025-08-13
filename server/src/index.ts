import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";

import router from "#/infrastructure/router";
import auth from "#/services/auth";
import store from "#/services/store";

const app = router();

app.use("*", cors());

app.route("/auth", auth);
app.route("/store", store);

showRoutes(app);

export default app;
