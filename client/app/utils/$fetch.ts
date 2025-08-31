import { createFetch } from "@better-fetch/fetch";
import z from "zod";
import env from "~/env";
import { refreshAccessToken } from "~/lib/refresh-access-token";
import { authStore } from "~/store/auth";

export const $fetch = createFetch({
  baseURL: env.VITE_API_URL,
  retry: {
    type: "linear",
    attempts: 3,
    delay: 1000,
  },
  mode: "cors",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  auth: {
    type: "Bearer",
    token: () => authStore.getState().accessToken,
  },
  defaultError: z.object({
    errors: z.array(
      z.object({
        code: z.string(),
        path: z.array(z.string()),
        message: z.string(),
      })
    ),
  }),
  async onError(ctx) {
    console.log(ctx.error);
    if (ctx.error.status === 401) {
      await refreshAccessToken();
    }
  },
  onRequest(context) {
    console.log(context);
  },
  onResponse(context) {
    console.log(context.response);
  },
});
