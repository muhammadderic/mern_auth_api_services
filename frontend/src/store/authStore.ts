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
}

export const useAuthStore = create<AuthStore>(() => ({
  user: null,
  isAuthenticated: false,
}))