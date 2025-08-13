import { success } from "#/utils/response";
import { create } from "#/utils/router";

const login = create();

login.post("/", async (ctx) => {
  return ctx.json(success("logged in"));
});

export default login;
