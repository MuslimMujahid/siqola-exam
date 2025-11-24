import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserMembershipStatus } from "@/lib/api/users";
import { useAuthStore } from "@/store/auth";
import React from "react";

export function useUpdateUserStatus(userId: string) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const updateUserStatusMutation = useMutation({
    mutationFn: (status: "ACTIVE" | "SUSPENDED") => {
      const institutionId = currentUser?.memberships?.[0]?.institution?.id;
      if (!institutionId) {
        throw new Error("Institution ID not found");
      }
      return updateUserMembershipStatus(userId, institutionId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success("Status pengguna berhasil diperbarui");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message || "Gagal memperbarui status pengguna"
      );
    },
  });

  const handleUpdateStatus = React.useCallback(
    (status: "ACTIVE" | "SUSPENDED") => {
      updateUserStatusMutation.mutate(status);
    },
    [updateUserStatusMutation]
  );

  return {
    updateUserStatus: handleUpdateStatus,
    isLoading: updateUserStatusMutation.isPending,
    error: updateUserStatusMutation.error,
    isSuccess: updateUserStatusMutation.isSuccess,
  };
}
