import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { UserRole, UserStatus } from "@/modules/users/entities";
import { logout as logoutApi } from "../api/login";

export type Institution = {
  id: string;
  name: string;
  logo?: string;
};

export type Membership = {
  id: string;
  status: UserStatus;
  institution: {
    id: string;
    name: string;
    logo?: string;
  };
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  memberships?: Membership[];
  groupMembers?: Array<{
    id: string;
    group: {
      id: string;
      name: string;
    };
  }>;
};

type AuthState = {
  institution: Institution | null;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setInstitution: (institution: Institution | null) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (state: boolean) => void;
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
      _hasHydrated: false,
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
      setHasHydrated: (state) => set({ _hasHydrated: state }),
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        institution: state.institution,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
