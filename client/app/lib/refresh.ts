import { authStore } from "~/stores/auth";
import { $fetch } from "~/utils/$fetch";

export async function refreshAccessToken() {
  const { setToken, clearToken } = authStore.getState();

  const { data, error } = await $fetch<{
    token: string;
  }>("/auth/refresh", { method: "POST" });

  if (error) {
    clearToken();
    console.log(error);
    return null;
  }

  setToken(data.token); // 🔑 update store
  return data.token;
}
