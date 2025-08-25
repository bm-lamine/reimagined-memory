import { hn } from "main/utils";
import complaint from "./router/complaint";

const website = hn();

website.route("/complaint", complaint);

export default website;
