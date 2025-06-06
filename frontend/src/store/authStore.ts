import axios, { AxiosError } from "axios";
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

type SignupParams = {
  username: string;
  email: string;
  password: string;
}

type VerifyEmailParams = {
  verificationCode: string;
}

type LoginParams = {
  email: string;
  password: string;
}

type ForgotPasswordParams = {
  email: string;
}

type ResetPasswordParams = {
  token: string;
  password: string;
}

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  message: string | null;
  signup: (params: SignupParams) => Promise<void>;
  verifyEmail: (params: VerifyEmailParams) => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (params: ForgotPasswordParams) => Promise<void>;
  resetPassword: (params: ResetPasswordParams) => Promise<void>;
}

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/auth" : "/api/v1/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  message: null,

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
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      set({
        error: err.response?.data?.message || "Error logging in",
        isLoading: false,
      });

      throw error;
    }
  },

  logout: async () => {
    set({
      isLoading: true,
      error: null
    });

    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      set({
        error: err.response?.data?.message || "Error logging out",
        isLoading: false,
      });

      throw error;
    }
  },

  forgotPassword: async ({ email }: ForgotPasswordParams) => {
    set({
      isLoading: true,
      error: null
    });

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });

      set({
        message: response.data.message,
        isLoading: false
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      set({
        error: err.response?.data?.message || "Error sending reset password email",
        isLoading: false,
      });

      throw error;
    }
  },

  resetPassword: async ({ token, password }: ResetPasswordParams) => {
    set({
      isLoading: true,
      error: null
    });

    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });

      set({
        message: response.data.message,
        isLoading: false
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      set({
        error: err.response?.data?.message || "Error resetting password",
        isLoading: false,
      });

      throw error;
    }
  },
}))