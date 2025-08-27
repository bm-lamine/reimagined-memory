import proposalSchema from "@enjoy/schema/store/proposal.schema";
import { STATUS_CODE } from "config/codes";
import proposalRepo from "db/repos/store/proposal.repo";
import { failed, hn, ok, valid } from "main/utils";
import z from "zod";

const proposal = hn();

proposal.get("/", async (ctx) => {
  const units = await proposalRepo.query();
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

proposal.get(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const proposal = await proposalRepo.queryById(id);

    if (!proposal) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "proposal not found" }]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "proposal fetched",
        data: proposal,
        next: undefined,
      })
    );
  }
);

proposal.post("/", valid("json", proposalSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const proposal = await proposalRepo.create(data);

  if (!proposal) {
    return ctx.json(
      failed([
        { code: "custom", path: [], message: "creating proposal failed" },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "proposal created",
      data: proposal,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

proposal.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", proposalSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");

    if (!(await proposalRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating proposal failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const proposal = await proposalRepo.update(id, data);
    if (!proposal) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating proposal failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "proposal updated",
        data: proposal,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

proposal.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const proposal = await proposalRepo.delete(id);

    if (!proposal) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "deleting proposal failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "proposal deleted",
        data: proposal,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default proposal;
