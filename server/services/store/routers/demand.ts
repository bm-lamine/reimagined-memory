import demandSchema from "@enjoy/schema/store/demand.schema";
import { STATUS_CODE } from "config/codes";
import { failed, hn, ok, valid } from "main/utils";
import demandRepo from "services/store/repos/demand.repo";
import z from "zod";

const category = hn();

category.get("/", async (ctx) => {
  const units = await demandRepo.query();
  return ctx.json(
    ok({
      success: true,
      message: "units fetched",
      data: units,
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
    const category = await demandRepo.queryById(id);

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

category.post("/", valid("json", demandSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const category = await demandRepo.create(data);

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
  valid("json", demandSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");

    if (!(await demandRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating category failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const category = await demandRepo.update(id, data);
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
    const category = await demandRepo.delete(id);

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
