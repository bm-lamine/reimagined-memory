import complaintSchema from "@enjoy/schema/website/complaint.schema";
import type { schema } from "@enjoy/server/db";
import type { InferSelectModel } from "drizzle-orm";
import type z from "zod";

export type Complaint = InferSelectModel<typeof schema.complaints>;

export type ComplaintCreate = z.infer<typeof complaintSchema.create>;
export type ComplaintUpdate = z.infer<typeof complaintSchema.update>;
