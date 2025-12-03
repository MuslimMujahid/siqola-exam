"use client";

import React from "react";

import { DashboardLayout } from "@/components/layout/dashboard";
import { AuthGuard } from "@/modules/auth/components/auth-guard";

export default function ExaminerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["EXAMINER"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
