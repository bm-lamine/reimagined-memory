import { hn } from "main/utils";
import base from "./routers/base";

const auth = hn();

auth.route("/base", base);

export default auth;
