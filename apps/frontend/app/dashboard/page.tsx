"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/modules/auth/store/auth";
import { AdminDashboard } from "@/modules/dashboard/pages/admin-dashboard";
import { ExaminerDashboard } from "@/modules/dashboard/pages/examiner-dashboard";
import { ExamineeDashboard } from "@/modules/dashboard/pages/examinee-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Render appropriate dashboard based on user role
  const userRole = user?.role?.toUpperCase();

  switch (userRole) {
    case "ADMIN":
      return <AdminDashboard />;
    case "EXAMINER":
      return <ExaminerDashboard />;
    case "EXAMINEE":
      return <ExamineeDashboard />;
    default:
      router.push("/dashboard/unauthorized");
      return null;
  }
}
