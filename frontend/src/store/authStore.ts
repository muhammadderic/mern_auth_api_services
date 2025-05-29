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
}

export const useAuthStore = create<AuthStoreTypes>(() => ({
  user: null,
}))