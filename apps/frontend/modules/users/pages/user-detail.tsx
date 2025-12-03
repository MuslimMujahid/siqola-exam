"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks";
import { useAuthStore } from "@/modules/auth/store/auth";
import { useUpdateMembershipStatus } from "../api/membership";
import { userQueryOptions } from "../api/users";
import { GroupMembershipTable } from "../components/group-membership-table";
import { ExamineeExamParticipation } from "../components/examinee-exam-participation";
import { ExaminerExamParticipation } from "../components/examiner-exam-participation";
import { UserProfileSummary } from "../components/user-profile-summary";
import { userRole } from "../entities";

export type UserDetailProps = {
  params: Promise<{ id: string }>;
};

export function UserDetail({ params }: UserDetailProps) {
  const { id: userId } = React.use(params);
  const router = useRouter();
  const { institution } = useAuthStore();

  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirm();

  // Fetch user data
  const { data: user, isLoading, error } = useQuery(userQueryOptions(userId));

  // Update membership status mutation
  const { mutate: updateUserStatus, isPending: isUpdatingUserStatus } =
    useUpdateMembershipStatus();

  const membership = user?.memberships?.find(
    (m) => m.institution.id === institution?.id
  );

  const handleToggleStatus = async () => {
    const currentStatus = membership?.status;

    if (!institution || !currentStatus) {
      toast.error("Terjadi kesalahan saat memperbarui status pengguna");
      return;
    }

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

    updateUserStatus({
      userId,
      institutionId: institution?.id,
      status: newStatus,
    });
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

  if (error || !user || !membership) {
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
          membership={membership}
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
