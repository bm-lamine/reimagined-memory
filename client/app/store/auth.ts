import { createStore } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
};

export const authStore = createStore<AuthState>()(
  persist<AuthState>(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      login: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      logout: () => set({ accessToken: undefined, refreshToken: undefined }),
    }),
    { name: "auth" }
  )
);
