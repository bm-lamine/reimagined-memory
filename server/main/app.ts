import { hn } from "main/utils";
import store from "services/store";
import website from "services/website";

const app = hn();

app.route("/store", store);
app.route("/website", website);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
