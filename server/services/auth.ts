import { hn } from "main/utils";

import login from "routers/auth/login";
import logout from "routers/auth/logout";
import refresh from "routers/auth/refresh";
import register from "routers/auth/register";
import resendEmailVerification from "routers/auth/resend-email-verification";
import session from "routers/auth/session";
import verifyEmail from "routers/auth/verify-email";

const auth = hn();

auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/register", register);
auth.route("/refresh", refresh);
auth.route("/session", session);
auth.route("/verify-email", verifyEmail);
auth.route("/resend-email-verification", resendEmailVerification);

export default auth;
