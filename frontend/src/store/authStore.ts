import axios from "axios";
import { create } from "zustand/react";

type User = {
  _id: string; // refers to mongodb id
  name: string;
  email: string;
  lastLogin: Date;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type SignupParams = {
  name: string;
  email: string;
  password: string;
}

type LoginParams = {
  email: string;
  password: string;
}

type VerifyEmailParams = {
  verificationCode: string;
}

type ForgotPasswordParams = {
  email: string;
}

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  message: string | null;
  signup: (params: SignupParams) => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  verifyEmail: (params: VerifyEmailParams) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (params: ForgotPasswordParams) => Promise<void>;
}

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/auth" : "/api/v1/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  message: null,

  signup: async ({ name, email, password }: SignupParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error signing in", isLoading: false });
      throw error;
    }
  },

  login: async ({ email, password }: LoginParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.data,
        error: null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false
      });
      throw error;
    }
  },

  verifyEmail: async (verificationCode: VerifyEmailParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, { verificationCode });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async ({ email }: ForgotPasswordParams) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });

      set({
        message: response.data.message,
        isLoading: false
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
}))