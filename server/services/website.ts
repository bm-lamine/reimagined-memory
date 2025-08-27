import { hn } from "main/utils";
import complaint from "routers/website/complaint";

const website = hn();

website.route("/complaint", complaint);

export default website;
