import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

/**
 * Custom hook for handling user logout
 * Provides a unified logout function that:
 * - Calls the auth store logout method (which clears state and calls logout API)
 * - Redirects to login page
 */
export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = useCallback(async () => {
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
