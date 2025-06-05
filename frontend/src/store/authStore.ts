import { create } from "zustand";

type User = {
  _id: string; // refers to mongodb id
  username: string;
  email: string;
  lastLogin: Date;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
}

export const useAuthStore = create<AuthStore>(() => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
}))