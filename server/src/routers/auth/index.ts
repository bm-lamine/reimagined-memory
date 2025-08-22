import { create } from "#/utils/router";

import login from "./api/login";
import logout from "./api/logout";
import register from "./api/register";

import getSession from "./api/get-session";
import resendVerification from "./api/resend-verification";
import verifyEmail from "./api/verify-email";

const auth = create();

auth.route("/login", login);
auth.route("/register", register);
auth.route("/logout", logout);

auth.route("/get-session", getSession);
auth.route("/verify-email", verifyEmail);
auth.route("/resend-verification", resendVerification);

export default auth;
