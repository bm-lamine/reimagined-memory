import { hn } from "main/utils";
import category from "./routers/category";
import unit from "./routers/unit";

const store = hn();

store.route("/unit", unit);
store.route("/category", category);

export default store;
