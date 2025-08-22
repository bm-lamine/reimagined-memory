import { create } from "#/utils/router";

// Product management

const product = create();

product.get("/", async (ctx) => {});

product.get("/:id", async (ctx) => {});

product.post("/", async (ctx) => {});

product.put("/:id", async (ctx) => {});

product.delete("/:id", async (ctx) => {});

export default product;
