import React from "react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api/client";
import { useMutationWrapper } from "@/hooks/use-mutation";
import { getDashboardRoute } from "@/lib/utils/dashboard";
import { UserRole, UserStatus } from "@/modules/users/entities";
import { useAuthStore } from "../store/auth";

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
    memberships: Array<{
      id: string;
      status: UserStatus;
      institution: {
        id: string;
        name: string;
        logo?: string;
      };
    }>;
    groupMembers: Array<{
      id: string;
      group: {
        id: string;
        name: string;
      };
    }>;
  };
  token: string;
}

/**
 * Login user
 */
export async function login(data: LoginParams): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);

  // Store the token in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem("token");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * Custom hook for handling user login
 * Provides login mutation with automatic state management and routing
 */
export function useLogin() {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated, setInstitution } =
    useAuthStore();

  return useMutationWrapper({
    mutationFn: login,
    onSuccess: (data) => {
      // Update auth store with user data and token
      setToken(data.token);
      setUser(data.user);
      // TODO: Select default the first institution for now
      // Later, implement institution selection if user has multiple memberships
      setInstitution(data.user.memberships?.[0]?.institution);
      setAuthenticated(true);

      // Redirect to appropriate dashboard based on user's role
      const dashboardRoute = getDashboardRoute(data.user.role);
      router.push(dashboardRoute);
    },
  });
}

/**
 * Custom hook for handling user logout
 * Provides a unified logout function that:
 * - Calls the auth store logout method (which clears state and calls logout API)
 * - Redirects to login page
 */
export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = React.useCallback(async () => {
    try {
      // Call logout from auth store (clears state and calls API)
      logout();

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still redirect even if there's an error
      router.push("/login");
    }
  }, [logout, router]);

  return { logout: handleLogout };
}
