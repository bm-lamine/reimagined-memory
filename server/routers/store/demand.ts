import demandSchema from "@enjoy/schema/store/demand.schema";
import { STATUS_CODE } from "config/codes";
import { failed, hn, ok, valid } from "main/utils";
import demandRepo from "repos/store/demand.repo";
import z from "zod";

const demand = hn();

demand.get("/", async (ctx) => {
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

demand.get("/:id", valid("param", z.object({ id: z.cuid2() })), async (ctx) => {
  const { id } = ctx.req.valid("param");
  const demand = await demandRepo.queryById(id);

  if (!demand) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "demand not found" }]),
      STATUS_CODE.BAD_REQUEST
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "demand fetched",
      data: demand,
      next: undefined,
    })
  );
});

demand.post("/", valid("json", demandSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const demand = await demandRepo.create(data);

  if (!demand) {
    return ctx.json(
      failed([{ code: "custom", path: [], message: "creating demand failed" }]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "demand created",
      data: demand,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

demand.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", demandSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");

    if (!(await demandRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating demand failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const demand = await demandRepo.update(id, data);
    if (!demand) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating demand failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "demand updated",
        data: demand,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

demand.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const demand = await demandRepo.delete(id);

    if (!demand) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "deleting demand failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "demand deleted",
        data: demand,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default demand;
