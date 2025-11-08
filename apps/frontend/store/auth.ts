import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Institution {
  id: string;
  institutionName: string;
  email: string;
  address: string;
  phoneNumber: string;
}

type AuthState = {
  institution: Institution | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      institution: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        institution: state.institution,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
