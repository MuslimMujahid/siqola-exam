"use client";

import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { DashboardLayout } from "@/components/layout/dashboard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
