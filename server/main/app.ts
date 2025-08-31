import { cors } from "hono/cors";
import * as dev from "hono/dev";
import { logger } from "hono/logger";
import { hn } from "main/utils";

import auth from "services/auth";
import store from "services/store";
import website from "services/website";

const app = hn();

app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(logger());

app.route("/store", store);
app.route("/website", website);
app.route("/auth", auth);

export default app;
