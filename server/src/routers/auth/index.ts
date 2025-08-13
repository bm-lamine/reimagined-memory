import { create } from "#/utils/router";
import login from "./api/login";

const auth = create();

auth.route("/login", login);

export default auth;
