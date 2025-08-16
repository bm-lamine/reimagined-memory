import z from "zod";

export default class Media {
  static readonly schema = z.object({
    id: z.cuid2({ error: "id required" }),
    name: z.string({ error: "name required" }),
    url: z.url({ error: "url required" }),
    upload: z.date({ error: "upload date required" }),
    type: z.enum(["doc", "img", "vid"], { error: "type required" }).nullable(),
    height: z.number().nullable(),
    width: z.number().nullable(),
  });
}
