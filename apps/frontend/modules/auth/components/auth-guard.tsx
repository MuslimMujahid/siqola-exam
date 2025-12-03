"use client";

import React from "react";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/modules/auth/store/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles = [],
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  React.useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!_hasHydrated) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If authenticated but no user data, something went wrong
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // If specific roles are required, check user's role
    if (allowedRoles.length > 0) {
      const userRole = user.role?.toUpperCase();
      const hasRequiredRole = allowedRoles.some(
        (role) => role.toUpperCase() === userRole
      );

      if (!hasRequiredRole) {
        // Redirect to appropriate dashboard or show unauthorized page
        router.push("/dashboard/unauthorized");
        return;
      }
    }
  }, [_hasHydrated, isAuthenticated, user, router, allowedRoles, redirectTo]);

  // Show loading while hydrating or checking authentication
  if (!_hasHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memeriksa Autentikasi</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
