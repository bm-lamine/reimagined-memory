import { hn } from "main/utils";
import category from "routers/store/category";
import demand from "routers/store/demand";
import proposal from "routers/store/proposal";
import subcategory from "routers/store/sub";
import unit from "routers/store/unit";

const store = hn();

store.route("/unit", unit);
store.route("/category", category);
store.route("/subcategory", subcategory);
store.route("/demand", demand);
store.route("/proposal", proposal);

export default store;
