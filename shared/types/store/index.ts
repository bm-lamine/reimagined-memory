import categorySchema from "@enjoy/schema/store/category.schema";
import demandSchema from "@enjoy/schema/store/demand.schema";
import mediaSchema from "@enjoy/schema/store/media.schema";
import proposalSchema from "@enjoy/schema/store/proposal.schema";
import unitSchema from "@enjoy/schema/store/unit.schema";
import productSchema from "@enjoy/schema/store/product.schema";
import subSchema from "@enjoy/schema/store/sub.schema";
import { schema } from "@enjoy/server/db";
import type { InferSelectModel } from "drizzle-orm";
import z from "zod";

export type Media = z.infer<typeof mediaSchema>;
export type Unit = InferSelectModel<typeof schema.units>;
export type Category = InferSelectModel<typeof schema.categories>;
export type Demand = InferSelectModel<typeof schema.demands>;
export type Sub = InferSelectModel<typeof schema.subs>;
export type Proposal = InferSelectModel<typeof schema.proposals>;
export type Product = InferSelectModel<typeof schema.products>;

export type UnitSelect = z.infer<typeof unitSchema.select>;
export type UnitCreate = z.infer<typeof unitSchema.create>;
export type UnitUpdate = z.infer<typeof unitSchema.update>;

export type CategorySelect = z.infer<typeof categorySchema.select>;
export type CategoryCreate = z.infer<typeof categorySchema.create>;
export type CategoryUpdate = z.infer<typeof categorySchema.update>;

export type DemandSelect = z.infer<typeof demandSchema.select>;
export type DemandCreate = z.infer<typeof demandSchema.create>;
export type DemandUpdate = z.infer<typeof demandSchema.update>;

export type ProposalSelect = z.infer<typeof proposalSchema.select>;
export type ProposalCreate = z.infer<typeof proposalSchema.create>;
export type ProposalUpdate = z.infer<typeof proposalSchema.update>;

export type SubSelect = z.infer<typeof subSchema.select>;
export type SubCreate = z.infer<typeof subSchema.create>;
export type SubUpdate = z.infer<typeof subSchema.update>;

export type ProductSelect = z.infer<typeof productSchema.select>;
export type ProductCreate = z.infer<typeof productSchema.create>;
export type ProductUpdate = z.infer<typeof productSchema.update>;
