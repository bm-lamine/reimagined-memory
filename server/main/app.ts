import store from "store";
import { hn } from "./utils";

const app = hn();

app.route("/store", store);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
