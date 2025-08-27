import { hn } from "main/utils";
import base from "routers/auth/base";

const auth = hn();

auth.route("/base", base);

export default auth;
