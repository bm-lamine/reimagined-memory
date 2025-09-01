import { createFetch } from "@better-fetch/fetch";
import z from "zod";

import env from "~/env";
import { refreshAccessToken } from "~/lib/refresh";
import { authStore } from "~/stores/auth";

export const $fetch = createFetch({
  baseURL: env.VITE_API_URL,
  mode: "cors",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  auth: {
    type: "Bearer",
    token: () => authStore.getState().token,
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
    if (ctx.error.status === 401) {
      await refreshAccessToken();
    }
  },
});
