import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";

import router from "#/infrastructure/router";
import auth from "#/services/auth";

const app = router();

app.use("*", cors());

app.route("/auth", auth);

showRoutes(app);

export default app;
