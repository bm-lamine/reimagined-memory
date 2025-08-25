import unitSchema from "@enjoy/schema/store/unit.schema";
import { STATUS_CODE } from "config/codes";
import { failed, hn, ok, valid } from "main/utils";
import unitRepo from "services/store/repos/unit.repo";
import z from "zod";

const unit = hn();

unit.get("/", async (ctx) => {
  const units = await unitRepo.query();
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

unit.get("/:id", valid("param", z.object({ id: z.cuid2() })), async (ctx) => {
  const { id } = ctx.req.valid("param");
  const unit = await unitRepo.queryById(id);

  if (!unit) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "unit not found" }]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "unit fetched",
      data: unit,
      next: undefined,
    })
  );
});

unit.post("/", valid("json", unitSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const conflicts = await unitRepo.getConflicts(data);

  if (conflicts.has("name")) {
    return ctx.json(
      failed([
        { code: "custom", path: ["name"], message: "unit name already used" },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  } else if (conflicts.has("alias")) {
    return ctx.json(
      failed([
        { code: "custom", path: ["alias"], message: "unit alias already used" },
      ]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  const unit = await unitRepo.create(data);

  if (!unit) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "creating unit failed" }]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "unit created",
      data: unit,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

unit.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", unitSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");
    const conflicts = await unitRepo.getConflicts(data);

    if (!(await unitRepo.queryById(id))) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "updating unit failed" }]),
        STATUS_CODE.BAD_REQUEST
      );
    } else if (conflicts.has("name")) {
      return ctx.json(
        failed([
          { code: "custom", path: ["name"], message: "unit name already used" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    } else if (conflicts.has("alias")) {
      return ctx.json(
        failed([
          {
            code: "custom",
            path: ["alias"],
            message: "unit alias already used",
          },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const unit = await unitRepo.update(id, data);

    if (!unit) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "updating unit failed" }]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "unit updated",
        data: unit,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

unit.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const unit = await unitRepo.delete(id);

    if (!unit) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "deleting unit failed" }]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "unit deleted",
        data: unit,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default unit;
