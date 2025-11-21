import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { login } from "@/lib/api/auth";
import { getDashboardRoute } from "@/lib/utils/dashboard";

interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Custom hook for handling user login
 * Provides login mutation with automatic state management and routing
 */
export function useLogin() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Update auth store with user data
      setUser(data.user);
      setAuthenticated(true);

      // Redirect to appropriate dashboard based on user's role
      const dashboardRoute = getDashboardRoute(data.user.memberships);
      router.push(dashboardRoute);
    },
  });

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      // Clear any existing errors before attempting login
      loginMutation.reset();
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  return {
    login: handleLogin,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
    reset: loginMutation.reset,
  };
}
