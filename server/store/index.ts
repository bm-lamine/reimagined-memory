import { hn } from "main/utils";
import unit from "./routers/unit";

const store = hn();

store.route("/unit", unit);

export default store;
