import axios, { AxiosError } from "axios";
import { create } from "zustand/react"

type User = {
  _id: string; // refers to mongodb id
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type SignupParams = {
  username: string;
  email: string;
  password: string;
}

type VerifyEmailParams = {
  verificationCode: string;
}

type AuthStoreTypes = {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  signup: (params: SignupParams) => Promise<void>;
  verifyEmail: (params: VerifyEmailParams) => Promise<void>;
}

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/auth" : "/api/v1/auth";

export const useAuthStore = create<AuthStoreTypes>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,

  signup: async ({ username, email, password }: SignupParams) => {
    set({
      isLoading: true,
      error: null
    });

    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, username });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      set({
        error: err.response?.data?.message || "Error signing in",
        isLoading: false,
      });

      throw error;
    }
  },

  verifyEmail: async (verificationCode: VerifyEmailParams) => {
    set({
      isLoading: true,
      error: null
    });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, { verificationCode });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false
      });

      return response.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      set({
        error: err.response?.data?.message || "Error verifying email",
        isLoading: false,
      });

      throw error;
    }
  },
}))