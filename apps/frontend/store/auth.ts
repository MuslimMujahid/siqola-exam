import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout as logoutApi } from "@/lib/api/auth";

interface Institution {
  id: string;
  institutionName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

interface Membership {
  id: string;
  role: string;
  status: string;
  institution: {
    id: string;
    name: string;
    logo?: string;
  };
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  memberships?: Membership[];
}

type AuthState = {
  institution: Institution | null;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  setInstitution: (institution: Institution | null) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      institution: null,
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      setInstitution: (institution) => set({ institution }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
      },
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setError: (error) => set({ error }),
      logout: () => {
        logoutApi();
        set({
          institution: null,
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        institution: state.institution,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
