import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export type AuthStore = {
  token: string | undefined;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: undefined }),
    }),
    { name: "authToken" } // stored in localStorage as "auth"
  )
);
