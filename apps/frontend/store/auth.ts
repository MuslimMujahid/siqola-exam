import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Institution {
  id: string;
  institutionName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
}

type AuthState = {
  institution: Institution | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setInstitution: (institution: Institution | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      institution: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setInstitution: (institution) => set({ institution }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      logout: () =>
        set({
          institution: null,
          user: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        institution: state.institution,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
