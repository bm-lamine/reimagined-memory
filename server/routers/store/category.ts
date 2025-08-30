import categorySchema from "@enjoy/schema/store/category.schema";
import { STATUS_CODE } from "config/codes";
import { failed, hn, ok, valid } from "main/utils";
import categoryRepo from "repos/store/category.repo";
import z from "zod";

const category = hn();

category.get("/", async (ctx) => {
  const categories = await categoryRepo.query();
  return ctx.json(
    ok({
      success: true,
      message: "categories fetched",
      data: categories,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

category.get(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const category = await categoryRepo.queryById(id);

    if (!category) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "category not found" }]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "category fetched",
        data: category,
        next: undefined,
      })
    );
  }
);

category.post("/", valid("json", categorySchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const conflicts = await categoryRepo.getConflicts(data);

  if (conflicts.has("name")) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: ["name"],
          message: "category name already used",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const category = await categoryRepo.create(data);

  if (!category) {
    return ctx.json(
      failed([
        { code: "custom", path: [], message: "creating category failed" },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "category created",
      data: category,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

category.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", categorySchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");
    const conflicts = await categoryRepo.getConflicts({ name: data.name });

    if (!(await categoryRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating category failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    } else if (conflicts.has("name")) {
      return ctx.json(
        failed([
          {
            code: "custom",
            path: ["name"],
            message: "category name already used",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const category = await categoryRepo.update(id, data);

    if (!category) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating category failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "category updated",
        data: category,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

category.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const category = await categoryRepo.delete(id);

    if (!category) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "deleting category failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "category deleted",
        data: category,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default category;
