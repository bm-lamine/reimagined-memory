import { authStore } from "~/store/auth";
import { $fetch } from "./$fetch";
import z from "zod";

export async function refreshAccessToken() {
  const { refreshToken, login, logout } = authStore.getState();
  if (!refreshToken) {
    logout();
    return null;
  }

  const { data, error } = await $fetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    output: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    }),
  });

  if (error) {
    logout();
    console.log(error);
    return null;
  }

  login(data.accessToken, data.refreshToken); // 🔑 update store
  return data.accessToken;
}
