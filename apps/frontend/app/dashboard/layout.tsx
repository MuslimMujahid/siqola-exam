"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/layout/dashboard";
import { useAuthStore } from "@/modules/auth/store/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  React.useEffect(() => {
    // Wait for hydration to complete
    if (!_hasHydrated) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, _hasHydrated, router]);

  // Show loading state while hydrating or checking auth
  if (!_hasHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Memuat Halaman...</p>
        </motion.div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
