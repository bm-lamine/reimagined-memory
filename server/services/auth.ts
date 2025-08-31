import { hn } from "main/utils";

import login from "routers/auth/login";
import logout from "routers/auth/logout";
import refresh from "routers/auth/refresh";
import register from "routers/auth/register";
import requestPasswordReset from "routers/auth/request-password-reset";
import resendEmailVerification from "routers/auth/resend-email-verification";
import resetPassword from "routers/auth/reset-password";
import session from "routers/auth/session";
import verifyEmail from "routers/auth/verify-email";
import verifyPasswordReset from "routers/auth/verify-password-reset";

const auth = hn();

auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/register", register);
auth.route("/refresh", refresh);
auth.route("/session", session);
auth.route("/verify-email", verifyEmail);
auth.route("/resend-email-verification", resendEmailVerification);
auth.route("/request-password-reset", requestPasswordReset);
auth.route("/verify-password-reset-token", verifyPasswordReset);
auth.route("/reset-password", resetPassword);

export default auth;
