import { create } from "zustand/react"

type User = {
  _id: string; // refers to mongodb id
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type AuthStoreTypes = {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}

export const useAuthStore = create<AuthStoreTypes>(() => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
}))