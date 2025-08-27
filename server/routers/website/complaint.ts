import complaintSchema from "@enjoy/schema/website/complaint.schema";
import { STATUS_CODE } from "config/codes";
import complaintRepo from "db/repos/website/complaint.repo";
import { failed, hn, ok, valid } from "main/utils";
import z from "zod";

const complaint = hn();

complaint.get("/", async (ctx) => {
  const complaints = await complaintRepo.query();
  return ctx.json(
    ok({
      success: true,
      message: "complaints fetched",
      data: complaints,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

complaint.get(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const complaint = await complaintRepo.queryById(id);

    if (!complaint) {
      return ctx.json(
        failed([{ code: "custom", path: [], message: "complaint not found" }]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "complaint fetched",
        data: complaint,
        next: undefined,
      })
    );
  }
);

complaint.post("/", valid("json", complaintSchema.create), async (ctx) => {
  const data = ctx.req.valid("json");
  const complaint = await complaintRepo.create(data);

  if (!complaint) {
    return ctx.json(
      failed([
        { code: "custom", path: [], message: "creating complaint failed" },
      ]),
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }

  return ctx.json(
    ok({
      success: true,
      message: "complaint created",
      data: complaint,
      next: undefined,
    }),
    STATUS_CODE.OK
  );
});

complaint.patch(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  valid("json", complaintSchema.update),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const data = ctx.req.valid("json");

    if (!(await complaintRepo.queryById(id))) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating complaint failed" },
        ]),
        STATUS_CODE.BAD_REQUEST
      );
    }

    const complaint = await complaintRepo.update(id, data);

    if (!complaint) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "updating complaint failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "complaint updated",
        data: complaint,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

complaint.delete(
  "/:id",
  valid("param", z.object({ id: z.cuid2() })),
  async (ctx) => {
    const { id } = ctx.req.valid("param");
    const complaint = await complaintRepo.delete(id);

    if (!complaint) {
      return ctx.json(
        failed([
          { code: "custom", path: [], message: "deleting complaint failed" },
        ]),
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
    }

    return ctx.json(
      ok({
        success: true,
        message: "complaint deleted",
        data: complaint,
        next: undefined,
      }),
      STATUS_CODE.OK
    );
  }
);

export default complaint;
