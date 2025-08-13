import router from "#/infrastructure/router";
import { apiError } from "#/lib/response";
import { StatusCodes } from "#/lib/status-codes";
import { validator } from "#/middlewares/validator";
import UnitRepo from "#/repos/store/units.repo";
import { UnitSchema } from "#/schema/store/units.schema";
import { HTTPException } from "hono/http-exception";
import z from "zod";

const units = router();

units.get("/", async (ctx) => {
  const units = await UnitRepo.getAll();

  if (!units.length) {
    throw new HTTPException(StatusCodes.NOT_FOUND, {
      message: "resource not found",
    });
  }

  return ctx.json({
    data: units,
    message: "units fetched",
  });
});

units.get(
  "/:id",
  validator(
    "param",
    z.object({
      id: z.cuid2(),
    })
  ),
  async (ctx) => {
    const unit = await UnitRepo.getFirst({
      id: ctx.req.valid("param").id,
    });

    if (!unit) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "resource not found",
      });
    }

    return ctx.json({
      data: unit,
      message: "unit fetched",
    });
  }
);

units.post("/", validator("json", UnitSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");

  const conflicts = await UnitRepo.getConflicts(data.name, data.short);
  const errors = conflicts.pair
    ? apiError([
        { code: "custom", path: ["name"], message: "name already used" },
        { code: "custom", path: ["short"], message: "short already used" },
      ])
    : conflicts.name
      ? apiError([
          { code: "custom", path: ["name"], message: "name already used" },
        ])
      : conflicts.short
        ? apiError([
            { code: "custom", path: ["short"], message: "short already used" },
          ])
        : null;

  if (errors) {
    return ctx.json(errors, StatusCodes.BAD_REQUEST);
  }

  const unit = await UnitRepo.create({
    name: data.name,
    short: data.short,
  });

  if (!unit) {
    throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
      message: "resource not created",
    });
  }

  return ctx.json({
    data: unit,
    message: "unit created",
  });
});

units.post(
  "/:id",
  validator(
    "param",
    z.object({
      id: z.cuid2(),
    })
  ),
  validator("json", UnitSchema.update),
  async (ctx) => {
    const data = ctx.req.valid("json");
    const { id } = ctx.req.valid("param");

    const conflicts = await UnitRepo.getConflicts(data.name, data.short);
    const errors = conflicts.pair
      ? apiError([
          { code: "custom", path: ["name"], message: "name already used" },
          { code: "custom", path: ["short"], message: "short already used" },
        ])
      : conflicts.name
        ? apiError([
            { code: "custom", path: ["name"], message: "name already used" },
          ])
        : conflicts.short
          ? apiError([
              {
                code: "custom",
                path: ["short"],
                message: "short already used",
              },
            ])
          : null;

    if (errors) {
      return ctx.json(errors, StatusCodes.BAD_REQUEST);
    }

    const unit = await UnitRepo.update(id, data);

    if (!unit) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "resource not updated",
      });
    }

    return ctx.json({
      data: unit,
      message: "unit updated",
    });
  }
);

units.delete(
  "/:id",
  validator(
    "param",
    z.object({
      id: z.cuid2(),
    })
  ),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const unit = await UnitRepo.delete(id);

    if (!unit) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "resource not found",
      });
    }

    return ctx.json({
      data: unit,
      message: "unit deleted",
    });
  }
);

export default units;
