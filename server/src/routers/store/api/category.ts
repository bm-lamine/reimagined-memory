import { create } from "#/utils/router";

// Category and its Sub management

const category = create();

category.get("/", async (ctx) => {});

category.get("/:id", async (ctx) => {});

category.post("/", async (ctx) => {});

category.put("/:id", async (ctx) => {});

category.delete("/:id", async (ctx) => {});

export default category;
