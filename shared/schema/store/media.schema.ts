import z from "zod";

export default z.object({
  id: z.cuid2(),
  url: z.url(),
});
