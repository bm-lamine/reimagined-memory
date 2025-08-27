import productSchema from "@enjoy/schema/store/product.schema";
import { STATUS_CODE } from "config/codes";
import { failed, hn, ok, valid } from "main/utils";
import productRepo from "db/repos/store/product.repo";
import z from "zod";

const product = hn();

product.get("/", async (ctx) => {
  const products = await productRepo.query();
  return ctx.json(
    ok({
      success: true,
      message: "products fetched",
      data: products,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

product.get(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const product = await productRepo.queryById(id);

    if (!product) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "product not found" }]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "product fetched",
        data: product,
        next: undefined,
      })
    );
  }
);

product.post("/", valid("json", productSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const product = await productRepo.create(data);

  if (!product) {
    return ctx.json(
      failed([
        { code: "custom", path: [], message: "creating product failed" },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "product created",
      data: product,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

product.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", productSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");

    if (!(await productRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating product failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const product = await productRepo.update(id, data);

    if (!product) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating product failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "product updated",
        data: product,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

product.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const product = await productRepo.delete(id);

    if (!product) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "deleting product failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "product deleted",
        data: product,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default product;
