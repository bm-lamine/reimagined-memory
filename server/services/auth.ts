import { hn } from "main/utils";

import login from "routers/auth/login";
import logout from "routers/auth/logout";
import refresh from "routers/auth/refresh";
import register from "routers/auth/register";
import session from "routers/auth/session";

const auth = hn();

auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/register", register);
auth.route("/refresh", refresh);
auth.route("/session", session);

export default auth;
