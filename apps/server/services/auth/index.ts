import router from "#/infrastructure/router";
import login from "./api/login";
import logout from "./api/logout";
import register from "./api/register";
import resendVerification from "./api/resend-verification";
import session from "./api/session";
import verifyEmail from "./api/verify-email";

const auth = router();

auth.route("/login", login);
auth.route("/logout", logout);
auth.route("/register", register);

auth.route("/resend-verification", resendVerification);
auth.route("/verify-email", verifyEmail);

auth.route("/session", session);

export default auth;
