import { create } from "zustand/react";

type AuthStore = {
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  isAuthenticated: false,
}))