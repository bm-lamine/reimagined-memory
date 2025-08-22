import { create } from "#/utils/router";

import unit from "./api/unit";

const store = create();

store.route("/unit", unit);
// store.route("/category", category);
// store.route("/product", product);

export default store;
