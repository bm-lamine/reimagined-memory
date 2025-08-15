import { create } from "#/utils/router";

import login from "./api/login";
import register from "./api/register";

import resendVerification from "./api/resend-verification";
import verifyEmail from "./api/verify-email";

const auth = create();

auth.route("/login", login);
auth.route("/register", register);

auth.route("/verify-email", verifyEmail);
auth.route("/resend-verificatio", resendVerification);

export default auth;
