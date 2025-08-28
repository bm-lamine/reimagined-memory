import { hn } from "main/utils";

import login from "routers/auth/login";
import logout from "routers/auth/logout";
import register from "routers/auth/register";

const auth = hn();

auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/register", register);

export default auth;
