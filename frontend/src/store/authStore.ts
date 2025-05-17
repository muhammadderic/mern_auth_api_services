import axios from "axios";
import { create } from "zustand/react";

type User = {
  id: string;
  name: string;
  email: string;
  // add other user properties as needed
}

type SignupParams = {
  name: string;
  email: string;
  password: string;
}

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  signup: (params: SignupParams) => Promise<void>;
}

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/auth" : "/api/v1/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,

  signup: async ({ name, email, password }: SignupParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error signing in", isLoading: false });
      throw error;
    }
  },
}))