import mediaSchema from "@enjoy/schema/store/media.schema";
import unitSchema from "@enjoy/schema/store/unit.schema";
import complaintSchema from "@enjoy/schema/website/complaint.schema";
import { schema } from "@enjoy/server/db";
import type { InferSelectModel } from "drizzle-orm";
import z from "zod";

export type Unit = InferSelectModel<typeof schema.units>;
export type Complaint = InferSelectModel<typeof schema.complaints>;

export type Media = z.infer<typeof mediaSchema>;

export type UnitSelect = z.infer<typeof unitSchema.select>;
export type UnitCreate = z.infer<typeof unitSchema.create>;
export type UnitUpdate = z.infer<typeof unitSchema.update>;

export type ComplaintCreate = z.infer<typeof complaintSchema.create>;
export type ComplaintUpdate = z.infer<typeof complaintSchema.update>;
