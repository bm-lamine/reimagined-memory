import subSchema from "@enjoy/schema/store/sub.schema";
import { STATUS_CODE } from "config/codes";
import subRepo from "db/repos/store/sub.repo";
import { failed, hn, ok, valid } from "main/utils";
import z from "zod";

const subcategory = hn();

subcategory.get("/", async (ctx) => {
  const subcategories = await subRepo.query();
  return ctx.json(
    ok({
      success: true,
      message: "subcategories fetched",
      data: subcategories,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

subcategory.get(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const subcategory = await subRepo.queryById(id);

    if (!subcategory) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "subcategory not found" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "subcategory fetched",
        data: subcategory,
        next: undefined,
      })
    );
  }
);

subcategory.post("/", valid("json", subSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const conflicts = await subRepo.getConflicts(data);

  if (conflicts.has("name")) {
    return ctx.json(
      failed([
        {
          code: "custom",
          path: ["name"],
          message: "subcategory name already used",
        },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const subcategory = await subRepo.create(data);

  if (!subcategory) {
    return ctx.json(
      failed([
        { code: "custom", path: [], message: "creating subcategory failed" },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "subcategory created",
      data: subcategory,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

subcategory.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", subSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");
    const conflicts = await subRepo.getConflicts({ name: data.name });

    if (!(await subRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating subcategory failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    } else if (conflicts.has("name")) {
      return ctx.json(
        failed([
          {
            code: "custom",
            path: ["name"],
            message: "subcategory name already used",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const subcategory = await subRepo.update(id, data);

    if (!subcategory) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating subcategory failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "subcategory updated",
        data: subcategory,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

subcategory.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const subcategory = await subRepo.delete(id);

    if (!subcategory) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "deleting subcategory failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "subcategory deleted",
        data: subcategory,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default subcategory;
