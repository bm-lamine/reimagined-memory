import router from "#/infrastructure/router";
import units from "./units/api";

const store = router();

store.route("/units", units);

export default store;
