import unitSchema from "@enjoy/schema/store/unit.schema";
import z from "zod";

export type UnitSelect = z.infer<typeof unitSchema.select>;
export type UnitCreate = z.infer<typeof unitSchema.create>;
export type UnitUpdate = z.infer<typeof unitSchema.update>;
