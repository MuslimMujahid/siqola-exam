"use client";

import { DashboardLayout } from "@/components/layout/dashboard";
import { AuthGuard } from "@/modules/auth/components/auth-guard";

export default function ExamineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["EXAMINEE"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
