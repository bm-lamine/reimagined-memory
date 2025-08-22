import { STATUS_CODE } from "#/config/codes";
import { validator } from "#/middlewares/validator";
import unitRepo from "#/repos/store/unit.repo";
import { success } from "#/utils/response";
import { create } from "#/utils/router";
import { HTTPException } from "hono/http-exception";
import UnitSchema from "shared/schema/store/unit";
import z from "zod";

const unit = create();

unit.get("/", async (ctx) => {
  const units = await unitRepo.query.execute();
  return ctx.json(success("units fetched", undefined, units));
});

unit.get(
  "/:id",
  validator(
    "param",
    z.object({
      id: z.cuid2(),
    })
  ),
  async (ctx) => {
    const unit = await unitRepo.getById(ctx.req.valid("param").id);
    if (!unit) {
      throw new HTTPException(STATUS_CODE.NOT_FOUND, {
        message: "unit not found",
      });
    }

    return ctx.json(success("unit fetched", undefined, unit));
  }
);

unit.post("/", validator("json", UnitSchema.create), async (ctx) => {
  await unitRepo.create(ctx.req.valid("json"));
  return ctx.json(success("unit created", undefined));
});

unit.put(
  "/:id",
  validator("param", z.object({ id: z.cuid2() })),
  validator("json", UnitSchema.update),
  async (ctx) => {
    const unit = await unitRepo.update(
      ctx.req.valid("param").id,
      ctx.req.valid("json")
    );
    return ctx.json(success("unit updated", undefined, unit));
  }
);

unit.delete(
  "/:id",
  validator(
    "param",
    z.object({
      id: z.cuid2(),
    })
  ),
  async (ctx) => {
    const unit = await unitRepo.delete(ctx.req.valid("param").id);
    return ctx.json(success("unit deleted", undefined, unit));
  }
);

export default unit;
