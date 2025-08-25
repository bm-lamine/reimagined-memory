import { hn } from "main/utils";
import category from "./routers/category";
import demand from "./routers/demand";
import proposal from "./routers/proposal";
import subcategory from "./routers/sub";
import unit from "./routers/unit";

const store = hn();

store.route("/unit", unit);
store.route("/category", category);
store.route("/subcategory", subcategory);
store.route("/demand", demand);
store.route("/proposal", proposal);

export default store;
