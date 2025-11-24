"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";

import { userQueryOptions } from "@/lib/query/users";
import { useUpdateUserStatus, useConfirm } from "@/hooks";
import { Button } from "@/components/ui/button";
import { UserProfileSummary } from "./_components/user-profile-summary";
import { GroupMembershipTable } from "./_components/group-membership-table";
import { ExamineeExamParticipation } from "./_components/examinee-exam-participation";
import { ExaminerExamParticipation } from "./_components/examiner-exam-participation";
import { userRole } from "@/lib/entities/users";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirm();

  const userId = params.id as string;

  // Fetch user data
  const { data: user, isLoading, error } = useQuery(userQueryOptions(userId));

  // Update membership status mutation
  const { updateUserStatus, isLoading: isUpdatingUserStatus } =
    useUpdateUserStatus(userId);

  const handleToggleStatus = async () => {
    const currentStatus = user?.memberships?.[0]?.status;
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    // Show confirmation dialog when suspending
    if (newStatus === "SUSPENDED") {
      const confirmed = await confirm({
        title: "Tangguhkan Pengguna",
        description: `Apakah Anda yakin ingin menangguhkan akses ${user?.fullName}? Pengguna tidak akan dapat mengakses sistem sampai diaktifkan kembali.`,
        confirmText: "Tangguhkan",
        cancelText: "Batal",
        variant: "destructive",
      });

      if (!confirmed) return;
    }

    updateUserStatus(newStatus);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["user", userId] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Memuat data pengguna...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">Pengguna tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Pengguna yang Anda cari tidak ditemukan atau tidak tersedia.
          </p>
          <Button onClick={() => router.push("/dashboard/admin/users")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Pengguna
          </Button>
        </div>
      </div>
    );
  }

  const isExaminee = user.role === userRole.EXAMINEE;
  const isExaminer = user.role === userRole.EXAMINER;

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/admin/users")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Detail Pengguna
              </h2>
              <p className="text-muted-foreground mt-1">
                Informasi lengkap dan kelola pengguna
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Summary */}
        <UserProfileSummary
          user={user}
          onToggleStatus={handleToggleStatus}
          isUpdating={isUpdatingUserStatus}
        />

        {/* Group Membership - Show only for examinee */}
        {isExaminee && (
          <GroupMembershipTable user={user} onRefresh={handleRefresh} />
        )}

        {/* Exam Participation - Show for both examiners and examinees */}
        {isExaminee && <ExamineeExamParticipation userId={userId} />}
        {isExaminer && <ExaminerExamParticipation userId={userId} />}
      </div>
    </>
  );
}
