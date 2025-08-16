import type MediaClass from "#/schema/store/media";
import type z from "zod";

export type Media = z.infer<typeof MediaClass.schema>;
