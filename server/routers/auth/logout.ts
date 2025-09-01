import { hn, ok } from "main/utils";

const logout = hn();

logout.post("/", async (ctx) => {
  return ctx.json(
    ok({
      success: true,
      message: "user logged out",
      data: undefined,
      next: "/auth/login",
    })
  );
});

export default logout;
